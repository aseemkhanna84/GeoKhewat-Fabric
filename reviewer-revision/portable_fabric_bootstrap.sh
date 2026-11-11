#!/usr/bin/env bash
# Research-only portable adaptation of the archived native Fabric 2.5.16 setup.
# Never reuse certificates from prior executions or publish generated crypto/.
set -euo pipefail
ROOT="$(pwd)"
SRC="$ROOT/work/v1.5.1"
NET="$ROOT/work/fabric_native"
mkdir -p "$NET" "$ROOT/work/evidence"
cp -a "$SRC/fabric_native/." "$NET/"
# Work exclusively on extracted copies of the archived scripts, not the original archive.
python3 - "$ROOT" <<'PY'
import pathlib,sys
root=pathlib.Path(sys.argv[1])
net=root/"work/fabric_native"
replacement={
 "/home/claude/gk10/fabric_native":str(net),
 "/home/claude/gk10/chaincode_v14/geokhewat-chaincode":str(root/"work/v1.5.1/chaincode")
}
for p in net.rglob("*"):
    if not p.is_file() or p.suffix not in {".sh",".yaml",".yml",".js"}: continue
    s=p.read_text()
    for old,new in replacement.items():s=s.replace(old,new)
    p.write_text(s)
PY
chmod +x "$NET"/*.sh
# Pin a released official Fabric binary bundle. cryptogen is for ephemeral TEST identities only.
curl --retry 3 -fLsS \
  https://github.com/hyperledger/fabric/releases/download/v2.5.16/hyperledger-fabric-linux-amd64-2.5.16.tar.gz \
  -o "$ROOT/work/fabric.tar.gz"
printf '%s\n' "$(sha256sum "$ROOT/work/fabric.tar.gz")" > "$ROOT/work/evidence/fabric_release_sha256.txt"
mkdir -p "$NET/fabric"
tar -xzf "$ROOT/work/fabric.tar.gz" -C "$NET/fabric"
export PATH="$NET/fabric/bin:$PATH"
test "$(peer version | grep -o 'Version: 2.5.16' | head -1)" = "Version: 2.5.16"
echo "PEER=$(peer version | head -5)" >> "$ROOT/work/evidence/runtime_versions.txt"
echo "NODE=$(node --version)" >> "$ROOT/work/evidence/runtime_versions.txt"
sudo sh -c "printf '\n127.0.0.1 orderer.example.com peer0.survey.example.com peer0.revenue.example.com peer0.registration.example.com\n' >> /etc/hosts"
cd "$NET"
mkdir -p crypto artifacts data logs pkg
cryptogen generate --config=crypto-config.yaml --output=crypto > logs/cryptogen.log 2>&1
export FABRIC_CFG_PATH="$NET"
configtxgen -profile LandRecordsChannel -channelID landrecords -outputBlock artifacts/landrecords.block \
  > logs/configtxgen.log 2>&1
# Channel config & temporary TLS keys must NEVER be checked into the repository.
test -s artifacts/landrecords.block
test -f crypto/peerOrganizations/survey.example.com/users/User1@survey.example.com/msp/signcerts/User1@survey.example.com-cert.pem
test -f crypto/peerOrganizations/revenue.example.com/users/User1@revenue.example.com/msp/signcerts/User1@revenue.example.com-cert.pem
test -f crypto/peerOrganizations/registration.example.com/users/User1@registration.example.com/msp/signcerts/User1@registration.example.com-cert.pem
npm --prefix "$SRC/chaincode" ci --no-audit --no-fund
npm --prefix "$NET/client" ci --no-audit --no-fund
# Log only nonsecret versions and checksums; don't upload crypto/, MSP keys, or TLS private keys.
sha256sum "$SRC/chaincode/lib/geokhewat-contract.js" "$SRC/chaincode/lib/exact.js" \
  > "$ROOT/work/evidence/chaincode_src_sha256.txt"
./start_network.sh > "$ROOT/work/evidence/start_network.log" 2>&1
echo "PORTABLE_THREE_ORG_BOOTSTRAP=PASS" | tee "$ROOT/work/evidence/boot_status.txt"
