#!/usr/bin/env bash
# Native, ephemeral 3-org Fabric v2.5.16 bootstrap. NO private keys are committed.
set -euo pipefail
ROOT="$(pwd)"
NET="$ROOT/work/v1.5.1/fabric_native"
mkdir -p "$NET/artifacts" "$NET/pkg" "$NET/logs" "$NET/data"
echo "NET=$NET" >> "$GITHUB_ENV"
echo "NET=$NET"
export NET
# Fetch official pinned Fabric binaries (includes cryptogen/configtxgen/peer/orderer/osnadmin)
curl -fLsS --retry 4 --retry-delay 3 \
  "https://github.com/hyperledger/fabric/releases/download/v2.5.16/hyperledger-fabric-linux-amd64-2.5.16.tar.gz" \
  -o "$NET/fabric-bin.tar.gz"
sha256sum "$NET/fabric-bin.tar.gz" | tee "$NET/artifacts/fabric-binary-sha256.txt"
tar -xzf "$NET/fabric-bin.tar.gz" -C "$NET"
test -x "$NET/bin/cryptogen"
mkdir -p "$NET/fabric"
ln -s "$NET/bin" "$NET/fabric/bin"
ln -s "$NET/config" "$NET/fabric/config"
# Rewrite archived absolute paths; no author credentials copied into public repository.
grep -rl '/home/claude/gk10' "$NET" --include='*.sh' --include='*.yaml' --include='*.js' |
  xargs -r sed -i "s|/home/claude/gk10/chaincode_v14/geokhewat-chaincode|$ROOT/work/v1.5.1/chaincode|g; s|/home/claude/gk10/fabric_native|$NET|g"
# Client source also uses absolute chaincode paths as a require() dependency.
grep -rl '/home/claude/gk10' "$NET/client" --include='*.js' |
  xargs -r sed -i "s|/home/claude/gk10/chaincode_v14/geokhewat-chaincode|$ROOT/work/v1.5.1/chaincode|g"
# Allow archived native configuration to address peers by their TLS host names on loopback.
printf '127.0.0.1 orderer.example.com peer0.survey.example.com peer0.revenue.example.com peer0.registration.example.com\n' |
  sudo tee -a /etc/hosts
export PATH="$NET/bin:$PATH" FABRIC_CFG_PATH="$NET/config"
cryptogen generate --config="$NET/crypto-config.yaml" --output="$NET/crypto" 2>&1 |
  tee "$NET/artifacts/cryptogen-stdout.txt"
configtxgen -profile LandRecordsChannel -channelID landrecords \
  -outputBlock "$NET/artifacts/landrecords.block" -configPath "$NET" 2>&1 |
  tee "$NET/artifacts/configtxgen-stdout.txt"
# Probe for required channel config and private certs, do not publish secret contents.
test -s "$NET/artifacts/landrecords.block"
for msp in survey revenue registration; do
 test -f "$NET/crypto/peerOrganizations/$msp.example.com/users/Admin@$msp.example.com/msp/config.yaml"
done
# Configure CCAAS external builder plugin (pinned to Fabric Samples v2.5.16 when available).
git clone --depth 1 --branch v2.5.16 https://github.com/hyperledger/fabric-samples.git "$NET/fabric-samples" || 
  git clone --depth 1 https://github.com/hyperledger/fabric-samples.git "$NET/fabric-samples"
mkdir -p "$NET/builders"
cp -a "$NET/fabric-samples/test-network/builders/ccaas" "$NET/builders/ccaas"
chmod +x "$NET/builders/ccaas/bin/"*
export CORE_CHAINCODE_EXTERNALBUILDERS="[{\"name\":\"ccaas_builder\",\"path\":\"$NET/builders/ccaas\",\"propagateEnvironment\":[\"CHAINCODE_AS_A_SERVICE_BUILDER_CONFIG\"]}]"
echo "CORE_CHAINCODE_EXTERNALBUILDERS=$CORE_CHAINCODE_EXTERNALBUILDERS" >> "$GITHUB_ENV"
# Native peers need a proper command environment; saved as dotenv for later workflow steps.
cat > "$NET/runtime-env.sh" <<ENV
export NET="$NET"
export PATH="$NET/bin:\$PATH"
export CORE_CHAINCODE_EXTERNALBUILDERS='$CORE_CHAINCODE_EXTERNALBUILDERS'
export NO_PROXY="\${NO_PROXY:-},.example.com,orderer.example.com,peer0.survey.example.com,peer0.revenue.example.com,peer0.registration.example.com"
export no_proxy="\$NO_PROXY"
ENV
source "$NET/runtime-env.sh"
# Persist peer and orderer logs for all failures; these can contain identities and must be scrubbed before publishing.
bash "$NET/start_network.sh"
source "$NET/env.sh"
peer_env survey Admin
peer channel getinfo -c landrecords | tee "$NET/artifacts/channel-info.txt"
echo 'PORTABLE_THREE_ORG_BOOTSTRAP=PASS' | tee "$NET/artifacts/bootstrap-status.txt"
