import { assert } from "chai";
import { ContractParser } from "../src/lib/ContractParser";
import nod3 from "../src/lib/nod3Connect";

const contracts = ["0xebea27d994371cd0cb9896ae4c926bc5221f6317"];

const parser = new ContractParser({ nod3 });

describe("# Network", function () {
  it("should be connected to RSK testnet", async function () {
    let net = await nod3.net.version();
    console.log(net);
    assert.equal(net.id, "31");
  });
});

describe("Contract parser", function () {
  for (let address of contracts) {
    it("should return the token data", async () => {
      let contract = parser.makeContract(address);
      const info = await parser.getTokenData(contract);
      console.log({ info });
    });
  }

  it("should detect ERC1967 proxy", async () => {
    const info = await parser.getEIP1967Info(
      "0xc41fe753ff1671b271e34cf1a5ab45c540192abd"
    );
    console.log("ERC1967", info);
  });
});
