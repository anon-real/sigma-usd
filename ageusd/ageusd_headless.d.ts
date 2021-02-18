/* tslint:disable */
/* eslint-disable */
/**
* newtype for box registers R4 - R9
*/
export enum NonMandatoryRegisterId {
/**
* id for R4 register
*/
  R4,
/**
* id for R5 register
*/
  R5,
/**
* id for R6 register
*/
  R6,
/**
* id for R7 register
*/
  R7,
/**
* id for R8 register
*/
  R8,
/**
* id for R9 register
*/
  R9,
}
/**
* Network type
*/
export enum NetworkPrefix {
/**
* Mainnet
*/
  Mainnet,
/**
* Testnet
*/
  Testnet,
}
/**
* Address types
*/
export enum AddressTypePrefix {
/**
* 0x01 - Pay-to-PublicKey(P2PK) address
*/
  P2PK,
/**
* 0x02 - Pay-to-Script-Hash(P2SH)
*/
  Pay2SH,
/**
* 0x03 - Pay-to-Script(P2S)
*/
  Pay2S,
}
/**
* A specified box which is an Oracle Pool box that stores a `Long` integer
* datapoint inside of R4 that represents how many lovelaces can be bought
* for 1 USD.
*/
export class AdaUsdOraclePoolBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
/**
* Extracts the Long datapoint out of register R4.
* @returns {BigInt}
*/
  datapoint(): BigInt;
/**
* Extracts the Long datapoint out of register R4.
* @returns {BigInt}
*/
  datapoint_in_cents(): BigInt;
}
/**
*
* * An address is a short string corresponding to some script used to protect a box. Unlike (string-encoded) binary
* * representation of a script, an address has some useful characteristics:
* *
* * - Integrity of an address could be checked., as it is incorporating a checksum.
* * - A prefix of address is showing network and an address type.
* * - An address is using an encoding (namely, Base58) which is avoiding similarly l0Oking characters, friendly to
* * double-clicking and line-breaking in emails.
* *
* *
* *
* * An address is encoding network type, address type, checksum, and enough information to watch for a particular scripts.
* *
* * Possible network types are:
* * Mainnet - 0x00
* * Testnet - 0x10
* *
* * For an address type, we form content bytes as follows:
* *
* * P2PK - serialized (compressed) public key
* * P2SH - first 192 bits of the Blake2b256 hash of serialized script bytes
* * P2S  - serialized script
* *
* * Address examples for testnet:
* *
* * 3   - P2PK (3WvsT2Gm4EpsM9Pg18PdY6XyhNNMqXDsvJTbbf6ihLvAmSb7u5RN)
* * ?   - P2SH (rbcrmKEYduUvADj9Ts3dSVSG27h54pgrq5fPuwB)
* * ?   - P2S (Ms7smJwLGbUAjuWQ)
* *
* * for mainnet:
* *
* * 9  - P2PK (9fRAWhdxEsTcdb8PhGNrZfwqa65zfkuYHAMmkQLcic1gdLSV5vA)
* * ?  - P2SH (8UApt8czfFVuTgQmMwtsRBZ4nfWquNiSwCWUjMg)
* * ?  - P2S (4MQyML64GnzMxZgm, BxKBaHkvrTvLZrDcZjcsxsF7aSsrN73ijeFZXtbj4CXZHHcvBtqSxQ)
* *
* *
* * Prefix byte = network type + address type
* *
* * checksum = blake2b256(prefix byte ++ content bytes)
* *
* * address = prefix byte ++ content bytes ++ checksum
* *
* 
*/
export class Address {
  free(): void;
/**
* Re-create the address from ErgoTree that was built from the address
*
* At some point in the past a user entered an address from which the ErgoTree was built.
* Re-create the address from this ErgoTree.
* `tree` - ErgoTree that was created from an Address
* @param {ErgoTree} ergo_tree
* @returns {Address}
*/
  static recreate_from_ergo_tree(ergo_tree: ErgoTree): Address;
/**
* Create a P2PK address from serialized PK bytes(EcPoint/GroupElement)
* @param {Uint8Array} bytes
* @returns {Address}
*/
  static p2pk_from_pk_bytes(bytes: Uint8Array): Address;
/**
* Decode (base58) testnet address from string, checking that address is from the testnet
* @param {string} s
* @returns {Address}
*/
  static from_testnet_str(s: string): Address;
/**
* Decode (base58) mainnet address from string, checking that address is from the mainnet
* @param {string} s
* @returns {Address}
*/
  static from_mainnet_str(s: string): Address;
/**
* Decode (base58) address from string without checking the network prefix
* @param {string} s
* @returns {Address}
*/
  static from_base58(s: string): Address;
/**
* Encode (base58) address
* @param {number} network_prefix
* @returns {string}
*/
  to_base58(network_prefix: number): string;
/**
* Decode from a serialized address (that includes the network prefix)
* @param {Uint8Array} data
* @returns {Address}
*/
  static from_bytes(data: Uint8Array): Address;
/**
* Encode address as serialized bytes (that includes the network prefix)
* @param {number} network_prefix
* @returns {Uint8Array}
*/
  to_bytes(network_prefix: number): Uint8Array;
/**
* Get the type of the address
* @returns {number}
*/
  address_type_prefix(): number;
/**
* Create an address from a public key
* @param {Uint8Array} bytes
* @returns {Address}
*/
  static from_public_key(bytes: Uint8Array): Address;
/**
* Creates an ErgoTree script from the address
* @returns {ErgoTree}
*/
  to_ergo_tree(): ErgoTree;
}
/**
* A box which represents a cast vote for updating the protocol
*/
export class BallotBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
}
/**
* The struct which represents the `Bank` stage.
*/
export class BankBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
/**
* Acquire the current Reserve Ratio in the Bank box
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  current_reserve_ratio(oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* Provides the base(Erg) reserves of the Bank. This is the total amount
* of nanoErgs held inside, minus the minimum box value required for
* posting a box on-chain.
* @returns {BigInt}
*/
  base_reserves(): BigInt;
/**
* Outstanding liabilities in `NanoErg`s to cover the current minted
* StableCoins (StableCoins in circulation)
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  liabilities(oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* The equity of the protocol. In other words what base reserves are left
* after having covered all liabilities.
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  equity(oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* The number of StableCoins currently minted. In other words the number
* currently in circulation. Held in R4 of Bank box.
* @returns {BigInt}
*/
  num_circulating_stablecoins(): BigInt;
/**
* The number of ReserveCoins currently minted. In other words the number
* currently in circulation. Held in R5 of Bank box.
* @returns {BigInt}
*/
  num_circulating_reservecoins(): BigInt;
/**
* Current StableCoin nominal price
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  stablecoin_nominal_price(oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* Current ReserveCoin nominal price
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  reservecoin_nominal_price(oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* Number of StableCoins possible to be minted based off of current Reserve Ratio
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  num_able_to_mint_stablecoin(oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* Number of ReserveCoins possible to be minted based off of current Reserve Ratio
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} current_height
* @returns {BigInt}
*/
  num_able_to_mint_reservecoin(oracle_box: ErgUsdOraclePoolBox, current_height: BigInt): BigInt;
/**
* Number of ReserveCoins possible to be redeemed based off of current Reserve Ratio.
* Checks if the provided `current_height` is before the COOLING_OFF_HEIGHT to verify
* as well.
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  num_able_to_redeem_reservecoin(oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* The total amount of nanoErgs which is needed to cover minting
* the provided number of ReserveCoins, cover tx fees, implementor
* fee, etc.
* @param {BigInt} amount_to_mint
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  total_cost_to_mint_stablecoin(amount_to_mint: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of nanoErg fees for minting StableCoins.
* This includes protocol fees, tx fees, and implementor fees.
* @param {BigInt} amount_to_mint
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  fees_from_minting_stablecoin(amount_to_mint: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of base currency (Ergs) which is needed to cover minting
* the provided number of StableCoins.
* @param {BigInt} amount_to_mint
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  base_cost_to_mint_stablecoin(amount_to_mint: BigInt, oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* The total amount of nanoErgs which is needed to cover minting
* the provided number of ReserveCoins, cover tx fees, implementor
* fee, etc.
* @param {BigInt} amount_to_mint
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  total_cost_to_mint_reservecoin(amount_to_mint: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of nanoErg fees for minting ReserveCoins.
* This includes protocol fees, tx fees, and implementor fees.
* @param {BigInt} amount_to_mint
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  fees_from_minting_reservecoin(amount_to_mint: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of base currency (Ergs) which is needed to cover minting
* the provided number of ReserveCoins.
* @param {BigInt} amount_to_mint
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  base_cost_to_mint_reservecoin(amount_to_mint: BigInt, oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* The amount of nanoErgs which will be redeemed
* from the protocol based on current reserves + the number of
* ReserveCoins being redeemed by the user after paying for
* @param {BigInt} amount_to_redeem
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  total_amount_from_redeeming_reservecoin(amount_to_redeem: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of nanoErg fees for redeeming ReserveCoins.
* This includes protocol fees, tx fees, and implementor fees.
* @param {BigInt} amount_to_redeem
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  fees_from_redeeming_reservecoin(amount_to_redeem: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of base currency (Ergs) which will be redeemed
* from the protocol based on current reserves + the number of
* ReserveCoins being redeemed by the user. Includes protocol fee.
* @param {BigInt} amount_to_redeem
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  base_amount_from_redeeming_reservecoin(amount_to_redeem: BigInt, oracle_box: ErgUsdOraclePoolBox): BigInt;
/**
* The amount of nanoErgs which will be redeemed
* from the protocol based on current reserves + the number of
* StableCoins being redeemed by the user after paying for
* @param {BigInt} amount_to_redeem
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  total_amount_from_redeeming_stablecoin(amount_to_redeem: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of nanoErg fees for redeeming StableCoins.
* This includes protocol fees, tx fees, and implementor fees.
* @param {BigInt} amount_to_redeem
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BigInt} transaction_fee
* @returns {BigInt}
*/
  fees_from_redeeming_stablecoin(amount_to_redeem: BigInt, oracle_box: ErgUsdOraclePoolBox, transaction_fee: BigInt): BigInt;
/**
* The amount of base currency (Ergs) which will be redeemed
* from the protocol based on current reserves + the number of
* StableCoins being redeemed by the user.
* @param {BigInt} amount_to_redeem
* @param {ErgUsdOraclePoolBox} oracle_box
* @returns {BigInt}
*/
  base_amount_from_redeeming_stablecoin(amount_to_redeem: BigInt, oracle_box: ErgUsdOraclePoolBox): BigInt;
}
/**
* Box id (32-byte digest)
*/
export class BoxId {
  free(): void;
/**
* Base16 encoded string
* @returns {string}
*/
  to_str(): string;
}
/**
* Selected boxes with change boxes (by [`BoxSelector`])
*/
export class BoxSelection {
  free(): void;
/**
* Create a selection to easily inject custom selection algorithms
* @param {ErgoBoxes} boxes
* @param {ErgoBoxAssetsDataList} change
*/
  constructor(boxes: ErgoBoxes, change: ErgoBoxAssetsDataList);
/**
* Selected boxes to spend as transaction inputs
* @returns {ErgoBoxes}
*/
  boxes(): ErgoBoxes;
/**
* Selected boxes to use as change
* @returns {ErgoBoxAssetsDataList}
*/
  change(): ErgoBoxAssetsDataList;
}
/**
* A specification which specifies parameters of an `ErgoBox`.
* This spec is used as a "source of truth" to both verify and find
* `ErgoBox`es which match the spec. This is often used for defining
* Stages in multi-stage smart contract protocols, but can also be used
* to define input boxes for Actions.
* All fields are wrapped in `Option`s to allow ignoring specifying
* the field.
*/
export class BoxSpec {
  free(): void;
/**
* @returns {string}
*/
  utxo_scan_json(): string;
/**
* Returns a new `BoxSpec` with all fields exactly the same
* except the address is set to the String provided as input.
* This method is generally used to hone down a more generic
* `BoxSpec` definition into a more specific one for your given
* use case. Ie. Add a user's P2PK address to find boxes matching
* the `BoxSpec` in their wallet.
* @param {string | undefined} address
* @returns {BoxSpec}
*/
  modified_address(address?: string): BoxSpec;
/**
* @param {ErgoBox} wrapped_ergo_box
* @returns {boolean}
*/
  w_verify_box(wrapped_ergo_box: ErgoBox): boolean;
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  w_explorer_endpoint(explorer_api_url: string): string;
/**
* @param {string} explorer_response_body
* @returns {ErgoBoxes}
*/
  w_process_explorer_response(explorer_response_body: string): ErgoBoxes;
}
/**
* Box value in nanoERGs with bound checks
*/
export class BoxValue {
  free(): void;
/**
* Recommended (safe) minimal box value to use in case box size estimation is unavailable.
* Allows box size upto 2777 bytes with current min box value per byte of 360 nanoERGs
* @returns {BoxValue}
*/
  static SAFE_USER_MIN(): BoxValue;
/**
* Number of units inside one ERGO (i.e. one ERG using nano ERG representation)
* @returns {I64}
*/
  static UNITS_PER_ERGO(): I64;
/**
* Create from i64 with bounds check
* @param {I64} v
* @returns {BoxValue}
*/
  static from_i64(v: I64): BoxValue;
/**
* Get value as signed 64-bit long (I64)
* @returns {I64}
*/
  as_i64(): I64;
}
/**
* Ergo constant(evaluated) values
*/
export class Constant {
  free(): void;
/**
* Decode from Base16-encoded ErgoTree serialized value
* @param {string} base16_bytes_str
* @returns {Constant}
*/
  static decode_from_base16(base16_bytes_str: string): Constant;
/**
* Encode as Base16-encoded ErgoTree serialized value
* @returns {string}
*/
  encode_to_base16(): string;
/**
* Create from i32 value
* @param {number} v
* @returns {Constant}
*/
  static from_i32(v: number): Constant;
/**
* Extract i32 value, returning error if wrong type
* @returns {number}
*/
  to_i32(): number;
/**
* Create from i64
* @param {I64} v
* @returns {Constant}
*/
  static from_i64(v: I64): Constant;
/**
* Extract i64 value, returning error if wrong type
* @returns {I64}
*/
  to_i64(): I64;
/**
* Create from byte array
* @param {Uint8Array} v
* @returns {Constant}
*/
  static from_byte_array(v: Uint8Array): Constant;
/**
* Extract byte array, returning error if wrong type
* @returns {Uint8Array}
*/
  to_byte_array(): Uint8Array;
}
/**
* Proof of correctness of tx spending
*/
export class ContextExtension {
  free(): void;
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* get from map or fail if key is missing
* @param {number} key
* @returns {Constant}
*/
  get(key: number): Constant;
/**
* Returns all keys in the map
* @returns {Uint8Array}
*/
  keys(): Uint8Array;
}
/**
* Defines the contract(script) that will be guarding box contents
*/
export class Contract {
  free(): void;
/**
* create new contract that allow spending of the guarded box by a given recipient ([`Address`])
* @param {Address} recipient
* @returns {Contract}
*/
  static pay_to_address(recipient: Address): Contract;
}
/**
* Inputs, that are used to enrich script context, but won't be spent by the transaction
*/
export class DataInput {
  free(): void;
/**
* Get box id
* @returns {BoxId}
*/
  box_id(): BoxId;
}
/**
* DataInput collection
*/
export class DataInputs {
  free(): void;
/**
* Create empty DataInputs
*/
  constructor();
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {DataInput}
*/
  get(index: number): DataInput;
/**
* Adds an elements to the collection
* @param {DataInput} elem
*/
  add(elem: DataInput): void;
}
/**
* A specified box which is an Oracle Pool box that stores a `Long` integer
* datapoint inside of R4 that represents how many nanoErgs can be bought
* for 1 USD.
*/
export class ErgUsdOraclePoolBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
/**
* Extracts the Long datapoint out of register R4.
* @returns {BigInt}
*/
  datapoint(): BigInt;
/**
* Extracts the Long datapoint out of register R4.
* @returns {BigInt}
*/
  datapoint_in_cents(): BigInt;
}
/**
* Ergo box, that is taking part in some transaction on the chain
* Differs with [`ErgoBoxCandidate`] by added transaction id and an index in the input of that transaction
*/
export class ErgoBox {
  free(): void;
/**
* make a new box with:
* `value` - amount of money associated with the box
* `contract` - guarding contract([`Contract`]), which should be evaluated to true in order
* to open(spend) this box
* `creation_height` - height when a transaction containing the box is created.
* `tx_id` - transaction id in which this box was "created" (participated in outputs)
* `index` - index (in outputs) in the transaction
* @param {BoxValue} value
* @param {number} creation_height
* @param {Contract} contract
* @param {TxId} tx_id
* @param {number} index
* @param {Tokens} tokens
*/
  constructor(value: BoxValue, creation_height: number, contract: Contract, tx_id: TxId, index: number, tokens: Tokens);
/**
* Get box id
* @returns {BoxId}
*/
  box_id(): BoxId;
/**
* Get box creation height
* @returns {number}
*/
  creation_height(): number;
/**
* Get tokens for box
* @returns {Tokens}
*/
  tokens(): Tokens;
/**
* Get ergo tree for box
* @returns {ErgoTree}
*/
  ergo_tree(): ErgoTree;
/**
* Get box value in nanoERGs
* @returns {BoxValue}
*/
  value(): BoxValue;
/**
* Returns value (ErgoTree constant) stored in the register or None if the register is empty
* @param {number} register_id
* @returns {Constant | undefined}
*/
  register_value(register_id: number): Constant | undefined;
/**
* JSON representation
* @returns {any}
*/
  to_json(): any;
/**
* JSON representation
* @param {string} json
* @returns {ErgoBox}
*/
  static from_json(json: string): ErgoBox;
}
/**
* Pair of <value, tokens> for an box
*/
export class ErgoBoxAssetsData {
  free(): void;
/**
* Create empty SimpleBoxSelector
* @param {BoxValue} value
* @param {Tokens} tokens
*/
  constructor(value: BoxValue, tokens: Tokens);
/**
* Value part of the box
* @returns {BoxValue}
*/
  value(): BoxValue;
/**
* Tokens part of the box
* @returns {Tokens}
*/
  tokens(): Tokens;
}
/**
* List of asset data for a box
*/
export class ErgoBoxAssetsDataList {
  free(): void;
/**
* Create empty Tokens
*/
  constructor();
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {ErgoBoxAssetsData}
*/
  get(index: number): ErgoBoxAssetsData;
/**
* Adds an elements to the collection
* @param {ErgoBoxAssetsData} elem
*/
  add(elem: ErgoBoxAssetsData): void;
}
/**
* ErgoBox candidate not yet included in any transaction on the chain
*/
export class ErgoBoxCandidate {
  free(): void;
/**
* Returns value (ErgoTree constant) stored in the register or None if the register is empty
* @param {number} register_id
* @returns {Constant | undefined}
*/
  register_value(register_id: number): Constant | undefined;
/**
* Get box creation height
* @returns {number}
*/
  creation_height(): number;
/**
* Get tokens for box
* @returns {Tokens}
*/
  tokens(): Tokens;
/**
* Get ergo tree for box
* @returns {ErgoTree}
*/
  ergo_tree(): ErgoTree;
/**
* Get box value in nanoERGs
* @returns {BoxValue}
*/
  value(): BoxValue;
}
/**
* ErgoBoxCandidate builder
*/
export class ErgoBoxCandidateBuilder {
  free(): void;
/**
* Create builder with required box parameters:
* `value` - amount of money associated with the box
* `contract` - guarding contract([`Contract`]), which should be evaluated to true in order
* to open(spend) this box
* `creation_height` - height when a transaction containing the box is created.
* It should not exceed height of the block, containing the transaction with this box.
* @param {BoxValue} value
* @param {Contract} contract
* @param {number} creation_height
*/
  constructor(value: BoxValue, contract: Contract, creation_height: number);
/**
* Set minimal value (per byte of the serialized box size)
* @param {number} new_min_value_per_byte
*/
  set_min_box_value_per_byte(new_min_value_per_byte: number): void;
/**
* Get minimal value (per byte of the serialized box size)
* @returns {number}
*/
  min_box_value_per_byte(): number;
/**
* Set new box value
* @param {BoxValue} new_value
*/
  set_value(new_value: BoxValue): void;
/**
* Get box value
* @returns {BoxValue}
*/
  value(): BoxValue;
/**
* Calculate serialized box size(in bytes)
* @returns {number}
*/
  calc_box_size_bytes(): number;
/**
* Calculate minimal box value for the current box serialized size(in bytes)
* @returns {BoxValue}
*/
  calc_min_box_value(): BoxValue;
/**
* Set register with a given id (R4-R9) to the given value
* @param {number} register_id
* @param {Constant} value
*/
  set_register_value(register_id: number, value: Constant): void;
/**
* Returns register value for the given register id (R4-R9), or None if the register is empty
* @param {number} register_id
* @returns {Constant | undefined}
*/
  register_value(register_id: number): Constant | undefined;
/**
* Delete register value(make register empty) for the given register id (R4-R9)
* @param {number} register_id
*/
  delete_register_value(register_id: number): void;
/**
* Mint token, as defined in https://github.com/ergoplatform/eips/blob/master/eip-0004.md
* `token` - token id(box id of the first input box in transaction) and token amount,
* `token_name` - token name (will be encoded in R4),
* `token_desc` - token description (will be encoded in R5),
* `num_decimals` - number of decimals (will be encoded in R6)
* @param {Token} token
* @param {string} token_name
* @param {string} token_desc
* @param {number} num_decimals
*/
  mint_token(token: Token, token_name: string, token_desc: string, num_decimals: number): void;
/**
* Add given token id and token amount
* @param {TokenId} token_id
* @param {TokenAmount} amount
*/
  add_token(token_id: TokenId, amount: TokenAmount): void;
/**
* Build the box candidate
* @returns {ErgoBoxCandidate}
*/
  build(): ErgoBoxCandidate;
}
/**
* Collection of ErgoBoxCandidates
*/
export class ErgoBoxCandidates {
  free(): void;
/**
* Create new outputs
* @param {ErgoBoxCandidate} box_candidate
*/
  constructor(box_candidate: ErgoBoxCandidate);
/**
* sometimes it's useful to keep track of an empty list
* but keep in mind Ergo transactions need at least 1 output
* @returns {ErgoBoxCandidates}
*/
  static empty(): ErgoBoxCandidates;
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {ErgoBoxCandidate}
*/
  get(index: number): ErgoBoxCandidate;
/**
* Add an element to the collection
* @param {ErgoBoxCandidate} b
*/
  add(b: ErgoBoxCandidate): void;
}
/**
* Collection of ErgoBox'es
*/
export class ErgoBoxes {
  free(): void;
/**
* parse ErgoBox array from json
* @param {any[]} boxes
* @returns {ErgoBoxes}
*/
  static from_boxes_json(boxes: any[]): ErgoBoxes;
/**
* Create new collection with one element
* @param {ErgoBox} b
*/
  constructor(b: ErgoBox);
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Add an element to the collection
* @param {ErgoBox} b
*/
  add(b: ErgoBox): void;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {ErgoBox}
*/
  get(index: number): ErgoBox;
}
/**
* TBD
*/
export class ErgoStateContext {
  free(): void;
/**
* empty (dummy) context (for signing P2PK tx only)
* @returns {ErgoStateContext}
*/
  static dummy(): ErgoStateContext;
}
/**
* The root of ErgoScript IR. Serialized instances of this class are self sufficient and can be passed around.
*/
export class ErgoTree {
  free(): void;
/**
* Decode from base16 encoded serialized ErgoTree
* @param {string} s
* @returns {ErgoTree}
*/
  static from_base16_bytes(s: string): ErgoTree;
/**
* Decode from encoded serialized ErgoTree
* @param {Uint8Array} data
* @returns {ErgoTree}
*/
  static from_bytes(data: Uint8Array): ErgoTree;
/**
* Encode Ergo tree as serialized bytes
* @returns {Uint8Array}
*/
  to_bytes(): Uint8Array;
}
/**
* A specified box which is intended to be spent for the Ergs inside.
* The spec simply requires the box to simply have at least `1000000`
* nanoErgs inside.
*/
export class ErgsBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
}
/**
* Wrapper for i64 for JS/TS
*/
export class I64 {
  free(): void;
/**
* Create from a standard rust string representation
* @param {string} string
* @returns {I64}
*/
  static from_str(string: string): I64;
/**
* String representation of the value for use from environments that don't support i64
* @returns {string}
*/
  to_str(): string;
/**
* Get the value as JS number (64-bit float)
* @returns {number}
*/
  as_num(): number;
/**
* Addition with overflow check
* @param {I64} other
* @returns {I64}
*/
  checked_add(other: I64): I64;
}
/**
* Signed inputs used in signed transactions
*/
export class Input {
  free(): void;
/**
* Get box id
* @returns {BoxId}
*/
  box_id(): BoxId;
/**
* Get the spending proof
* @returns {ProverResult}
*/
  spending_proof(): ProverResult;
}
/**
* Collection of signed inputs
*/
export class Inputs {
  free(): void;
/**
* Create empty Inputs
*/
  constructor();
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {Input}
*/
  get(index: number): Input;
}
/**
* helper methods to get the fee address for various networks
*/
export class MinerAddress {
  free(): void;
/**
* address to use in mainnet for the fee
* @returns {string}
*/
  static mainnet_fee_address(): string;
/**
* address to use in testnet for the fee
* @returns {string}
*/
  static testnet_fee_address(): string;
}
/**
* Combination of an Address with a network
* These two combined together form a base58 encoding
*/
export class NetworkAddress {
  free(): void;
/**
* create a new NetworkAddress(address + network prefix) for a given network type
* @param {number} network
* @param {Address} address
* @returns {NetworkAddress}
*/
  static new(network: number, address: Address): NetworkAddress;
/**
* Decode (base58) a NetworkAddress (address + network prefix) from string
* @param {string} s
* @returns {NetworkAddress}
*/
  static from_base58(s: string): NetworkAddress;
/**
* Encode (base58) address
* @returns {string}
*/
  to_base58(): string;
/**
* Decode from a serialized address
* @param {Uint8Array} data
* @returns {NetworkAddress}
*/
  static from_bytes(data: Uint8Array): NetworkAddress;
/**
* Encode address as serialized bytes
* @returns {Uint8Array}
*/
  to_bytes(): Uint8Array;
/**
* Network for the address
* @returns {number}
*/
  network(): number;
/**
* Get address without network information
* @returns {Address}
*/
  address(): Address;
}
/**
* Proof of correctness of tx spending
*/
export class ProverResult {
  free(): void;
/**
* Get proof
* @returns {Uint8Array}
*/
  proof(): Uint8Array;
/**
* Get extension
* @returns {ContextExtension}
*/
  extension(): ContextExtension;
/**
* JSON representation
* @returns {any}
*/
  to_json(): any;
}
/**
* A struct which allows a developer to create a specification of a
* Register in a box. This `RegisterSpec` is used in a `BoxSpec.
*/
export class RegisterSpec {
  free(): void;
}
/**
* A predicated box which holds ReserveCoins
*/
export class ReserveCoinBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
/**
* Get the amount of tokens within the box
* @returns {BigInt}
*/
  readonly token_amount: BigInt;
}
/**
* Secret key for the prover
*/
export class SecretKey {
  free(): void;
/**
* generate random key
* @returns {SecretKey}
*/
  static random_dlog(): SecretKey;
/**
* Parse dlog secret key from bytes (SEC-1-encoded scalar)
* @param {Uint8Array} bytes
* @returns {SecretKey}
*/
  static dlog_from_bytes(bytes: Uint8Array): SecretKey;
/**
* Address (encoded public image)
* @returns {Address}
*/
  get_address(): Address;
/**
* Encode from a serialized key
* @returns {Uint8Array}
*/
  to_bytes(): Uint8Array;
}
/**
* SecretKey collection
*/
export class SecretKeys {
  free(): void;
/**
* Create empty SecretKeys
*/
  constructor();
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {SecretKey}
*/
  get(index: number): SecretKey;
/**
* Adds an elements to the collection
* @param {SecretKey} elem
*/
  add(elem: SecretKey): void;
}
/**
* Naive box selector, collects inputs until target balance is reached
*/
export class SimpleBoxSelector {
  free(): void;
/**
* Create empty SimpleBoxSelector
*/
  constructor();
/**
* Selects inputs to satisfy target balance and tokens.
* `inputs` - available inputs (returns an error, if empty),
* `target_balance` - coins (in nanoERGs) needed,
* `target_tokens` - amount of tokens needed.
* Returns selected inputs and box assets(value+tokens) with change.
* @param {ErgoBoxes} inputs
* @param {BoxValue} target_balance
* @param {Tokens} target_tokens
* @returns {BoxSelection}
*/
  select(inputs: ErgoBoxes, target_balance: BoxValue, target_tokens: Tokens): BoxSelection;
}
/**
* A predicated box which holds StableCoins
*/
export class StableCoinBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
/**
* Get the amount of tokens within the box
* @returns {BigInt}
*/
  readonly token_amount: BigInt;
}
/**
* The struct which represents our multi-stage smart contract protocol
*/
export class StableCoinProtocol {
  free(): void;
/**
* Create a new StableCoinProtocol
*/
  constructor();
/**
* Action: Mint ReserveCoin by providing Ergs.
* This is the WASM Tx Assembler wrapper function for said Action.
* @param {BigInt} amount_to_mint
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {BigInt} total_input_nano_ergs
* @param {string} implementor_address
* @returns {string}
*/
  w_assembler_mint_reservecoin(amount_to_mint: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, total_input_nano_ergs: BigInt, implementor_address: string): string;
/**
* Action: Mint StableCoin by providing Ergs.
* This is the WASM Tx Assembler wrapper function for said Action.
* @param {BigInt} amount_to_mint
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {BigInt} total_input_nano_ergs
* @param {string} implementor_address
* @returns {string}
*/
  w_assembler_mint_stablecoin(amount_to_mint: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, total_input_nano_ergs: BigInt, implementor_address: string): string;
/**
* Action: Redeem ReserveCoin.
* This is the WASM Tx Assembler wrapper function for said Action.
* @param {BigInt} amount_being_redeemed
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {string} implementor_address
* @returns {string}
*/
  w_assembler_redeem_reservecoin(amount_being_redeemed: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, implementor_address: string): string;
/**
* Action: Redeem ReserveCoin.
* This is the WASM Tx Assembler wrapper function for said Action.
* @param {BigInt} amount_being_redeemed
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {string} implementor_address
* @returns {string}
*/
  w_assembler_redeem_stablecoin(amount_being_redeemed: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, implementor_address: string): string;
/**
* Action: Mint ReserveCoin by providing Ergs.
* This is the WASM wrapper function for said Action.
* @param {BigInt} amount_to_mint
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {ErgoBoxes} ergo_boxes
* @param {string} implementor_address
* @returns {UnsignedTransaction}
*/
  w_action_mint_reservecoin(amount_to_mint: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, ergo_boxes: ErgoBoxes, implementor_address: string): UnsignedTransaction;
/**
* Action: Mint StableCoins by providing Ergs.
* This is the WASM wrapper function for said Action.
* @param {BigInt} amount_to_mint
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {ErgoBoxes} ergo_boxes
* @param {string} implementor_address
* @returns {UnsignedTransaction}
*/
  w_action_mint_stablecoin(amount_to_mint: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, ergo_boxes: ErgoBoxes, implementor_address: string): UnsignedTransaction;
/**
* Action: Redeem ReserveCoins for Ergs.
* This is the WASM wrapper function for said Action.
* @param {BigInt} amount_to_redeem
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {ErgoBoxes} rc_boxes
* @param {string} implementor_address
* @returns {UnsignedTransaction}
*/
  w_action_redeem_reservecoin(amount_to_redeem: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, rc_boxes: ErgoBoxes, implementor_address: string): UnsignedTransaction;
/**
* Action: Redeem ReserveCoins for Ergs.
* This is the WASM wrapper function for said Action.
* @param {BigInt} amount_to_redeem
* @param {string} user_address
* @param {BigInt} transaction_fee
* @param {BigInt} current_height
* @param {ErgUsdOraclePoolBox} oracle_box
* @param {BankBox} bank_box
* @param {ErgoBoxes} sc_boxes
* @param {string} implementor_address
* @returns {UnsignedTransaction}
*/
  w_action_redeem_stablecoin(amount_to_redeem: BigInt, user_address: string, transaction_fee: BigInt, current_height: BigInt, oracle_box: ErgUsdOraclePoolBox, bank_box: BankBox, sc_boxes: ErgoBoxes, implementor_address: string): UnsignedTransaction;
/**
* @returns {string}
*/
  readonly bank_nft_id: string;
/**
* @returns {BigInt}
*/
  readonly max_reserve_ratio: BigInt;
/**
* @returns {BigInt}
*/
  readonly min_box_value: BigInt;
/**
* @returns {BigInt}
*/
  readonly min_reserve_ratio: BigInt;
/**
* @returns {BigInt}
*/
  readonly reservecoin_default_price: BigInt;
/**
* @returns {string}
*/
  readonly reservecoin_token_id: string;
/**
* @returns {string}
*/
  readonly stablecoin_token_id: string;
}
/**
* Token represented with token id paired with it's amount
*/
export class Token {
  free(): void;
/**
* Create a token with given token id and amount
* @param {TokenId} token_id
* @param {TokenAmount} amount
*/
  constructor(token_id: TokenId, amount: TokenAmount);
/**
* Get token id
* @returns {TokenId}
*/
  id(): TokenId;
/**
* Get token amount
* @returns {TokenAmount}
*/
  amount(): TokenAmount;
/**
* JSON representation
* @returns {any}
*/
  to_json(): any;
}
/**
* Token amount with bound checks
*/
export class TokenAmount {
  free(): void;
/**
* Create from i64 with bounds check
* @param {I64} v
* @returns {TokenAmount}
*/
  static from_i64(v: I64): TokenAmount;
/**
* Get value as signed 64-bit long (I64)
* @returns {I64}
*/
  as_i64(): I64;
}
/**
* Token id (32 byte digest)
*/
export class TokenId {
  free(): void;
/**
* Create token id from erbo box id (32 byte digest)
* @param {BoxId} box_id
* @returns {TokenId}
*/
  static from_box_id(box_id: BoxId): TokenId;
/**
* Parse token id (32 byte digets) from base16-encoded string
* @param {string} str
* @returns {TokenId}
*/
  static from_str(str: string): TokenId;
/**
* Base16 encoded string
* @returns {string}
*/
  to_str(): string;
}
/**
* A struct which allows a developer to create a specification of a
* token in a box. This `TokenSpec` is used in a `BoxSpec.
*/
export class TokenSpec {
  free(): void;
}
/**
* Array of tokens
*/
export class Tokens {
  free(): void;
/**
* Create empty Tokens
*/
  constructor();
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {Token}
*/
  get(index: number): Token;
/**
* Adds an elements to the collection
* @param {Token} elem
*/
  add(elem: Token): void;
}
/**
*
* * ErgoTransaction is an atomic state transition operation. It destroys Boxes from the state
* * and creates new ones. If transaction is spending boxes protected by some non-trivial scripts,
* * its inputs should also contain proof of spending correctness - context extension (user-defined
* * key-value map) and data inputs (links to existing boxes in the state) that may be used during
* * script reduction to crypto, signatures that satisfies the remaining cryptographic protection
* * of the script.
* * Transactions are not encrypted, so it is possible to browse and view every transaction ever
* * collected into a block.
* 
*/
export class Transaction {
  free(): void;
/**
* Get id for transaction
* @returns {TxId}
*/
  id(): TxId;
/**
* JSON representation
* @returns {any}
*/
  to_json(): any;
/**
* Inputs for transaction
* @returns {Inputs}
*/
  inputs(): Inputs;
/**
* Data inputs for transaction
* @returns {DataInputs}
*/
  data_inputs(): DataInputs;
/**
* Outputs for transaction
* @returns {ErgoBoxCandidates}
*/
  outputs(): ErgoBoxCandidates;
}
/**
* This is a struct which is used to generate Ergo Tx Assembler Spec `String`s
* from `UnsignedTransaction`s.
*/
export class TxAssemblerSpecBuilder {
  free(): void;
/**
* WASM wrapper for `new()`
* @param {UnsignedTransaction} wrapped_unsigned_tx
* @returns {TxAssemblerSpecBuilder}
*/
  static w_new(wrapped_unsigned_tx: UnsignedTransaction): TxAssemblerSpecBuilder;
/**
* Create a placeholder box that holds an amount of nanoErgs equal to the
* input `nano_ergs` value and then wrap said box as a `ErgsBox`.
* This is useful for using with protocols as a placeholder so that
* an assembler spec can be created (and this placeholder box thrown out
* and replaced with the user's actual input box from the assembler)
* @param {BigInt} nano_ergs
* @returns {ErgsBox | undefined}
*/
  static create_placeholder_ergs_box(nano_ergs: BigInt): ErgsBox | undefined;
/**
* Builds a JSON `String` which
* is formatted as a transaction spec for working with the
* Ergo Transaction Assembler Service.
* @param {BigInt} transaction_fee
* @returns {string}
*/
  build_assembler_spec(transaction_fee: BigInt): string;
}
/**
* Unsigned transaction builder
*/
export class TxBuilder {
  free(): void;
/**
* Suggested transaction fee (semi-default value used across wallets and dApps as of Oct 2020)
* @returns {BoxValue}
*/
  static SUGGESTED_TX_FEE(): BoxValue;
/**
* Creates new TxBuilder
* `box_selection` - selected input boxes (via [`super::box_selector`])
* `output_candidates` - output boxes to be "created" in this transaction,
* `current_height` - chain height that will be used in additionally created boxes (change, miner's fee, etc.),
* `fee_amount` - miner's fee,
* `change_address` - change (inputs - outputs) will be sent to this address,
* `min_change_value` - minimal value of the change to be sent to `change_address`, value less than that
* will be given to miners,
* @param {BoxSelection} box_selection
* @param {ErgoBoxCandidates} output_candidates
* @param {number} current_height
* @param {BoxValue} fee_amount
* @param {Address} change_address
* @param {BoxValue} min_change_value
* @returns {TxBuilder}
*/
  static new(box_selection: BoxSelection, output_candidates: ErgoBoxCandidates, current_height: number, fee_amount: BoxValue, change_address: Address, min_change_value: BoxValue): TxBuilder;
/**
* Set transaction's data inputs
* @param {DataInputs} data_inputs
*/
  set_data_inputs(data_inputs: DataInputs): void;
/**
* Build the unsigned transaction
* @returns {UnsignedTransaction}
*/
  build(): UnsignedTransaction;
/**
* Get inputs
* @returns {BoxSelection}
*/
  box_selection(): BoxSelection;
/**
* Get data inputs
* @returns {DataInputs}
*/
  data_inputs(): DataInputs;
/**
* Get outputs EXCLUDING fee and change
* @returns {ErgoBoxCandidates}
*/
  output_candidates(): ErgoBoxCandidates;
/**
* Get current height
* @returns {number}
*/
  current_height(): number;
/**
* Get fee amount
* @returns {BoxValue}
*/
  fee_amount(): BoxValue;
/**
* Get change
* @returns {Address}
*/
  change_address(): Address;
/**
* Get min change value
* @returns {BoxValue}
*/
  min_change_value(): BoxValue;
}
/**
* Transaction id
*/
export class TxId {
  free(): void;
/**
* Zero (empty) transaction id (to use as dummy value in tests)
* @returns {TxId}
*/
  static zero(): TxId;
/**
* get the tx id as bytes
* @returns {string}
*/
  to_str(): string;
/**
* convert a hex string into a TxId
* @param {string} s
* @returns {TxId}
*/
  static from_str(s: string): TxId;
}
/**
* Unsigned inputs used in constructing unsigned transactions
*/
export class UnsignedInput {
  free(): void;
/**
* Get box id
* @returns {BoxId}
*/
  box_id(): BoxId;
/**
* Get extension
* @returns {ContextExtension}
*/
  extension(): ContextExtension;
}
/**
* Collection of unsigned signed inputs
*/
export class UnsignedInputs {
  free(): void;
/**
* Create empty UnsignedInputs
*/
  constructor();
/**
* Returns the number of elements in the collection
* @returns {number}
*/
  len(): number;
/**
* Returns the element of the collection with a given index
* @param {number} index
* @returns {UnsignedInput}
*/
  get(index: number): UnsignedInput;
}
/**
* Unsigned (inputs without proofs) transaction
*/
export class UnsignedTransaction {
  free(): void;
/**
* Get id for transaction
* @returns {TxId}
*/
  id(): TxId;
/**
* Inputs for transaction
* @returns {UnsignedInputs}
*/
  inputs(): UnsignedInputs;
/**
* Data inputs for transaction
* @returns {DataInputs}
*/
  data_inputs(): DataInputs;
/**
* Outputs for transaction
* @returns {ErgoBoxCandidates}
*/
  outputs(): ErgoBoxCandidates;
/**
* JSON representation
* @returns {any}
*/
  to_json(): any;
/**
* JSON representation
* @param {string} json
* @returns {UnsignedTransaction}
*/
  static from_json(json: string): UnsignedTransaction;
}
/**
* The box which holds the Update NFT & the address to be used to
* update the protocol in R4.
*/
export class UpdateBox {
  free(): void;
/**
* @param {ErgoBox} ergo_box
*/
  constructor(ergo_box: ErgoBox);
/**
* @returns {BoxSpec}
*/
  w_box_spec(): BoxSpec;
/**
* @param {string} explorer_response_body
* @returns {any[]}
*/
  static w_process_explorer_response(explorer_response_body: string): any[];
/**
* @param {string} explorer_api_url
* @returns {string}
*/
  static w_explorer_endpoint(explorer_api_url: string): string;
}
/**
* A collection of secret keys. This simplified signing by matching the secret keys to the correct inputs automatically.
*/
export class Wallet {
  free(): void;
/**
* Create wallet instance loading secret key from mnemonic
* @param {string} _mnemonic_phrase
* @param {string} _mnemonic_pass
* @returns {Wallet}
*/
  static from_mnemonic(_mnemonic_phrase: string, _mnemonic_pass: string): Wallet;
/**
* Create wallet using provided secret key
* @param {SecretKeys} secret
* @returns {Wallet}
*/
  static from_secrets(secret: SecretKeys): Wallet;
/**
* Sign a transaction:
* `tx` - transaction to sign
* `boxes_to_spend` - boxes corresponding to [`UnsignedTransaction::inputs`]
* `data_boxes` - boxes corresponding to [`UnsignedTransaction::data_inputs`]
* @param {ErgoStateContext} _state_context
* @param {UnsignedTransaction} tx
* @param {ErgoBoxes} boxes_to_spend
* @param {ErgoBoxes} data_boxes
* @returns {Transaction}
*/
  sign_transaction(_state_context: ErgoStateContext, tx: UnsignedTransaction, boxes_to_spend: ErgoBoxes, data_boxes: ErgoBoxes): Transaction;
}
