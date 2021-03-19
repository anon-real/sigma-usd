import * as wasm from './ageusd_headless_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4);
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}
/**
* newtype for box registers R4 - R9
*/
export const NonMandatoryRegisterId = Object.freeze({
/**
* id for R4 register
*/
R4:4,"4":"R4",
/**
* id for R5 register
*/
R5:5,"5":"R5",
/**
* id for R6 register
*/
R6:6,"6":"R6",
/**
* id for R7 register
*/
R7:7,"7":"R7",
/**
* id for R8 register
*/
R8:8,"8":"R8",
/**
* id for R9 register
*/
R9:9,"9":"R9", });
/**
* Network type
*/
export const NetworkPrefix = Object.freeze({
/**
* Mainnet
*/
Mainnet:0,"0":"Mainnet",
/**
* Testnet
*/
Testnet:16,"16":"Testnet", });
/**
* Address types
*/
export const AddressTypePrefix = Object.freeze({
/**
* 0x01 - Pay-to-PublicKey(P2PK) address
*/
P2PK:1,"1":"P2PK",
/**
* 0x02 - Pay-to-Script-Hash(P2SH)
*/
Pay2SH:2,"2":"Pay2SH",
/**
* 0x03 - Pay-to-Script(P2S)
*/
Pay2S:3,"3":"Pay2S", });
/**
* A specified box which is an Oracle Pool box that stores a `Long` integer
* datapoint inside of R4 that represents how many lovelaces can be bought
* for 1 USD.
*/
export class AdaUsdOraclePoolBox {

    static __wrap(ptr) {
        const obj = Object.create(AdaUsdOraclePoolBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_adausdoraclepoolbox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.adausdoraclepoolbox_w_new(ptr0);
        return AdaUsdOraclePoolBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.adausdoraclepoolbox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.adausdoraclepoolbox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.adausdoraclepoolbox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Extracts the Long datapoint out of register R4.
    * @returns {BigInt}
    */
    datapoint() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.adausdoraclepoolbox_datapoint(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Extracts the Long datapoint out of register R4.
    * @returns {BigInt}
    */
    datapoint_in_cents() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.adausdoraclepoolbox_datapoint_in_cents(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
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

    static __wrap(ptr) {
        const obj = Object.create(Address.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr);
    }
    /**
    * Re-create the address from ErgoTree that was built from the address
    *
    * At some point in the past a user entered an address from which the ErgoTree was built.
    * Re-create the address from this ErgoTree.
    * `tree` - ErgoTree that was created from an Address
    * @param {ErgoTree} ergo_tree
    * @returns {Address}
    */
    static recreate_from_ergo_tree(ergo_tree) {
        _assertClass(ergo_tree, ErgoTree);
        var ret = wasm.address_recreate_from_ergo_tree(ergo_tree.ptr);
        return Address.__wrap(ret);
    }
    /**
    * Create a P2PK address from serialized PK bytes(EcPoint/GroupElement)
    * @param {Uint8Array} bytes
    * @returns {Address}
    */
    static p2pk_from_pk_bytes(bytes) {
        var ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_p2pk_from_pk_bytes(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * Decode (base58) testnet address from string, checking that address is from the testnet
    * @param {string} s
    * @returns {Address}
    */
    static from_testnet_str(s) {
        var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_testnet_str(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * Decode (base58) mainnet address from string, checking that address is from the mainnet
    * @param {string} s
    * @returns {Address}
    */
    static from_mainnet_str(s) {
        var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_mainnet_str(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * Decode (base58) address from string without checking the network prefix
    * @param {string} s
    * @returns {Address}
    */
    static from_base58(s) {
        var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_base58(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * Encode (base58) address
    * @param {number} network_prefix
    * @returns {string}
    */
    to_base58(network_prefix) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_to_base58(retptr, this.ptr, network_prefix);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Decode from a serialized address (that includes the network prefix)
    * @param {Uint8Array} data
    * @returns {Address}
    */
    static from_bytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_bytes(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * Encode address as serialized bytes (that includes the network prefix)
    * @param {number} network_prefix
    * @returns {Uint8Array}
    */
    to_bytes(network_prefix) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_to_bytes(retptr, this.ptr, network_prefix);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Get the type of the address
    * @returns {number}
    */
    address_type_prefix() {
        var ret = wasm.address_address_type_prefix(this.ptr);
        return ret >>> 0;
    }
    /**
    * Create an address from a public key
    * @param {Uint8Array} bytes
    * @returns {Address}
    */
    static from_public_key(bytes) {
        var ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.address_from_public_key(ptr0, len0);
        return Address.__wrap(ret);
    }
    /**
    * Creates an ErgoTree script from the address
    * @returns {ErgoTree}
    */
    to_ergo_tree() {
        var ret = wasm.address_to_ergo_tree(this.ptr);
        return ErgoTree.__wrap(ret);
    }
}
/**
* A box which represents a cast vote for updating the protocol
*/
export class BallotBox {

    static __wrap(ptr) {
        const obj = Object.create(BallotBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ballotbox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.ballotbox_w_new(ptr0);
        return BallotBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.ballotbox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.ballotbox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.ballotbox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* The struct which represents the `Bank` stage.
*/
export class BankBox {

    static __wrap(ptr) {
        const obj = Object.create(BankBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bankbox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.bankbox_w_new(ptr0);
        return BankBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.bankbox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.bankbox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.bankbox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Acquire the current Reserve Ratio in the Bank box
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    current_reserve_ratio(oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_current_reserve_ratio(retptr, this.ptr, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Provides the base(Erg) reserves of the Bank. This is the total amount
    * of nanoErgs held inside, minus the minimum box value required for
    * posting a box on-chain.
    * @returns {BigInt}
    */
    base_reserves() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bankbox_base_reserves(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Outstanding liabilities in `NanoErg`s to cover the current minted
    * StableCoins (StableCoins in circulation)
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    liabilities(oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_liabilities(retptr, this.ptr, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The equity of the protocol. In other words what base reserves are left
    * after having covered all liabilities.
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    equity(oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_equity(retptr, this.ptr, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The number of StableCoins currently minted. In other words the number
    * currently in circulation. Held in R4 of Bank box.
    * @returns {BigInt}
    */
    num_circulating_stablecoins() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bankbox_num_circulating_stablecoins(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The number of ReserveCoins currently minted. In other words the number
    * currently in circulation. Held in R5 of Bank box.
    * @returns {BigInt}
    */
    num_circulating_reservecoins() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.bankbox_num_circulating_reservecoins(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Current StableCoin nominal price
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    stablecoin_nominal_price(oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_stablecoin_nominal_price(retptr, this.ptr, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Current ReserveCoin nominal price
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    reservecoin_nominal_price(oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_reservecoin_nominal_price(retptr, this.ptr, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * the requested amount results in a new reserve ratio within the limits
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} amount
    * @returns {boolean}
    */
    able_to_mint_stablecoin_amount(oracle_box, amount) {
        _assertClass(oracle_box, ErgUsdOraclePoolBox);
        uint64CvtShim[0] = amount;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm.bankbox_able_to_mint_stablecoin_amount(this.ptr, oracle_box.ptr, low0, high0);
        return ret !== 0;
    }
    /**
    * Number of StableCoins possible to be minted based off of current Reserve Ratio
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    num_able_to_mint_stablecoin(oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_num_able_to_mint_stablecoin(retptr, this.ptr, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Acquire the new reserve ratio after minting `num_to_mint` Stablecoins
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} num_to_mint
    * @returns {BigInt}
    */
    mint_stablecoin_reserve_ratio(oracle_box, num_to_mint) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = num_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            wasm.bankbox_mint_stablecoin_reserve_ratio(retptr, this.ptr, oracle_box.ptr, low0, high0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The requested amount results in a new reserve ratio within the limits
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} amount
    * @param {BigInt} current_height
    * @returns {boolean}
    */
    able_to_mint_reservecoin_amount(oracle_box, amount, current_height) {
        _assertClass(oracle_box, ErgUsdOraclePoolBox);
        uint64CvtShim[0] = amount;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        uint64CvtShim[0] = current_height;
        const low1 = u32CvtShim[0];
        const high1 = u32CvtShim[1];
        var ret = wasm.bankbox_able_to_mint_reservecoin_amount(this.ptr, oracle_box.ptr, low0, high0, low1, high1);
        return ret !== 0;
    }
    /**
    * Number of ReserveCoins possible to be minted based off of current Reserve Ratio
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} current_height
    * @returns {BigInt}
    */
    num_able_to_mint_reservecoin(oracle_box, current_height) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = current_height;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            wasm.bankbox_num_able_to_mint_reservecoin(retptr, this.ptr, oracle_box.ptr, low0, high0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Acquire the new reserve ratio after minting `num_to_mint` Reservecoins
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} num_to_mint
    * @returns {BigInt}
    */
    mint_reservecoin_reserve_ratio(oracle_box, num_to_mint) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = num_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            wasm.bankbox_mint_reservecoin_reserve_ratio(retptr, this.ptr, oracle_box.ptr, low0, high0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The requested amount results in a new reserve ratio within the limits
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} amount
    * @returns {boolean}
    */
    able_to_redeem_reservecoin_amount(oracle_box, amount) {
        _assertClass(oracle_box, ErgUsdOraclePoolBox);
        uint64CvtShim[0] = amount;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm.bankbox_able_to_redeem_reservecoin_amount(this.ptr, oracle_box.ptr, low0, high0);
        return ret !== 0;
    }
    /**
    * Number of ReserveCoins possible to be redeemed based off of current Reserve Ratio.
    * Checks if the provided `current_height` is before the COOLING_OFF_HEIGHT to verify
    * as well.
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    num_able_to_redeem_reservecoin(oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_num_able_to_redeem_reservecoin(retptr, this.ptr, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Acquire the new reserve ratio after minting `num_to_redeem` Reservecoins
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} num_to_redeem
    * @returns {BigInt}
    */
    redeem_reservecoin_reserve_ratio(oracle_box, num_to_redeem) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = num_to_redeem;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            wasm.bankbox_redeem_reservecoin_reserve_ratio(retptr, this.ptr, oracle_box.ptr, low0, high0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The total amount of nanoErgs which is needed to cover minting
    * the provided number of ReserveCoins, cover tx fees, implementor
    * fee, etc.
    * @param {BigInt} amount_to_mint
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    total_cost_to_mint_stablecoin(amount_to_mint, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_total_cost_to_mint_stablecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of nanoErg fees for minting StableCoins.
    * This includes protocol fees, tx fees, and implementor fees.
    * @param {BigInt} amount_to_mint
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    fees_from_minting_stablecoin(amount_to_mint, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_fees_from_minting_stablecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of base currency (Ergs) which is needed to cover minting
    * the provided number of StableCoins.
    * @param {BigInt} amount_to_mint
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    base_cost_to_mint_stablecoin(amount_to_mint, oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_base_cost_to_mint_stablecoin(retptr, this.ptr, low0, high0, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The total amount of nanoErgs which is needed to cover minting
    * the provided number of ReserveCoins, cover tx fees, implementor
    * fee, etc.
    * @param {BigInt} amount_to_mint
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    total_cost_to_mint_reservecoin(amount_to_mint, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_total_cost_to_mint_reservecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of nanoErg fees for minting ReserveCoins.
    * This includes protocol fees, tx fees, and implementor fees.
    * @param {BigInt} amount_to_mint
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    fees_from_minting_reservecoin(amount_to_mint, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_fees_from_minting_reservecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of base currency (Ergs) which is needed to cover minting
    * the provided number of ReserveCoins.
    * @param {BigInt} amount_to_mint
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    base_cost_to_mint_reservecoin(amount_to_mint, oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_base_cost_to_mint_reservecoin(retptr, this.ptr, low0, high0, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of nanoErgs which will be redeemed
    * from the protocol based on current reserves + the number of
    * ReserveCoins being redeemed by the user after paying for
    * @param {BigInt} amount_to_redeem
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    total_amount_from_redeeming_reservecoin(amount_to_redeem, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_redeem;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_total_amount_from_redeeming_reservecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of nanoErg fees for redeeming ReserveCoins.
    * This includes protocol fees, tx fees, and implementor fees.
    * @param {BigInt} amount_to_redeem
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    fees_from_redeeming_reservecoin(amount_to_redeem, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_redeem;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_fees_from_redeeming_reservecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of base currency (Ergs) which will be redeemed
    * from the protocol based on current reserves + the number of
    * ReserveCoins being redeemed by the user. Includes protocol fee.
    * @param {BigInt} amount_to_redeem
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    base_amount_from_redeeming_reservecoin(amount_to_redeem, oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_redeem;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_base_amount_from_redeeming_reservecoin(retptr, this.ptr, low0, high0, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of nanoErgs which will be redeemed
    * from the protocol based on current reserves + the number of
    * StableCoins being redeemed by the user after paying for
    * @param {BigInt} amount_to_redeem
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    total_amount_from_redeeming_stablecoin(amount_to_redeem, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_redeem;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_total_amount_from_redeeming_stablecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of nanoErg fees for redeeming StableCoins.
    * This includes protocol fees, tx fees, and implementor fees.
    * @param {BigInt} amount_to_redeem
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @param {BigInt} transaction_fee
    * @returns {BigInt}
    */
    fees_from_redeeming_stablecoin(amount_to_redeem, oracle_box, transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_redeem;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            uint64CvtShim[0] = transaction_fee;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            wasm.bankbox_fees_from_redeeming_stablecoin(retptr, this.ptr, low0, high0, oracle_box.ptr, low1, high1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n2 = uint64CvtShim[0];
            return n2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The amount of base currency (Ergs) which will be redeemed
    * from the protocol based on current reserves + the number of
    * StableCoins being redeemed by the user.
    * @param {BigInt} amount_to_redeem
    * @param {ErgUsdOraclePoolBox} oracle_box
    * @returns {BigInt}
    */
    base_amount_from_redeeming_stablecoin(amount_to_redeem, oracle_box) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_redeem;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            wasm.bankbox_base_amount_from_redeeming_stablecoin(retptr, this.ptr, low0, high0, oracle_box.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n1 = uint64CvtShim[0];
            return n1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* Box id (32-byte digest)
*/
export class BoxId {

    static __wrap(ptr) {
        const obj = Object.create(BoxId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boxid_free(ptr);
    }
    /**
    * Base16 encoded string
    * @returns {string}
    */
    to_str() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.boxid_to_str(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* Selected boxes with change boxes (by [`BoxSelector`])
*/
export class BoxSelection {

    static __wrap(ptr) {
        const obj = Object.create(BoxSelection.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boxselection_free(ptr);
    }
    /**
    * Create a selection to easily inject custom selection algorithms
    * @param {ErgoBoxes} boxes
    * @param {ErgoBoxAssetsDataList} change
    */
    constructor(boxes, change) {
        _assertClass(boxes, ErgoBoxes);
        _assertClass(change, ErgoBoxAssetsDataList);
        var ret = wasm.boxselection_new(boxes.ptr, change.ptr);
        return BoxSelection.__wrap(ret);
    }
    /**
    * Selected boxes to spend as transaction inputs
    * @returns {ErgoBoxes}
    */
    boxes() {
        var ret = wasm.boxselection_boxes(this.ptr);
        return ErgoBoxes.__wrap(ret);
    }
    /**
    * Selected boxes to use as change
    * @returns {ErgoBoxAssetsDataList}
    */
    change() {
        var ret = wasm.boxselection_change(this.ptr);
        return ErgoBoxAssetsDataList.__wrap(ret);
    }
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

    static __wrap(ptr) {
        const obj = Object.create(BoxSpec.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boxspec_free(ptr);
    }
    /**
    * @returns {string}
    */
    utxo_scan_json() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.boxspec_utxo_scan_json(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
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
    modified_address(address) {
        var ptr0 = isLikeNone(address) ? 0 : passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.boxspec_modified_address(this.ptr, ptr0, len0);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {ErgoBox} wrapped_ergo_box
    * @returns {boolean}
    */
    w_verify_box(wrapped_ergo_box) {
        _assertClass(wrapped_ergo_box, ErgoBox);
        var ptr0 = wrapped_ergo_box.ptr;
        wrapped_ergo_box.ptr = 0;
        var ret = wasm.boxspec_w_verify_box(this.ptr, ptr0);
        return ret !== 0;
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.boxspec_w_explorer_endpoint(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} explorer_response_body
    * @returns {ErgoBoxes}
    */
    w_process_explorer_response(explorer_response_body) {
        var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.boxspec_w_process_explorer_response(this.ptr, ptr0, len0);
        return ErgoBoxes.__wrap(ret);
    }
}
/**
* Box value in nanoERGs with bound checks
*/
export class BoxValue {

    static __wrap(ptr) {
        const obj = Object.create(BoxValue.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_boxvalue_free(ptr);
    }
    /**
    * Recommended (safe) minimal box value to use in case box size estimation is unavailable.
    * Allows box size upto 2777 bytes with current min box value per byte of 360 nanoERGs
    * @returns {BoxValue}
    */
    static SAFE_USER_MIN() {
        var ret = wasm.boxvalue_SAFE_USER_MIN();
        return BoxValue.__wrap(ret);
    }
    /**
    * Number of units inside one ERGO (i.e. one ERG using nano ERG representation)
    * @returns {I64}
    */
    static UNITS_PER_ERGO() {
        var ret = wasm.boxvalue_UNITS_PER_ERGO();
        return I64.__wrap(ret);
    }
    /**
    * Create from i64 with bounds check
    * @param {I64} v
    * @returns {BoxValue}
    */
    static from_i64(v) {
        _assertClass(v, I64);
        var ret = wasm.boxvalue_from_i64(v.ptr);
        return BoxValue.__wrap(ret);
    }
    /**
    * Get value as signed 64-bit long (I64)
    * @returns {I64}
    */
    as_i64() {
        var ret = wasm.boxvalue_as_i64(this.ptr);
        return I64.__wrap(ret);
    }
}
/**
* Ergo constant(evaluated) values
*/
export class Constant {

    static __wrap(ptr) {
        const obj = Object.create(Constant.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_constant_free(ptr);
    }
    /**
    * Decode from Base16-encoded ErgoTree serialized value
    * @param {string} base16_bytes_str
    * @returns {Constant}
    */
    static decode_from_base16(base16_bytes_str) {
        var ptr0 = passStringToWasm0(base16_bytes_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.constant_decode_from_base16(ptr0, len0);
        return Constant.__wrap(ret);
    }
    /**
    * Encode as Base16-encoded ErgoTree serialized value
    * @returns {string}
    */
    encode_to_base16() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.constant_encode_to_base16(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Create from i32 value
    * @param {number} v
    * @returns {Constant}
    */
    static from_i32(v) {
        var ret = wasm.constant_from_i32(v);
        return Constant.__wrap(ret);
    }
    /**
    * Extract i32 value, returning error if wrong type
    * @returns {number}
    */
    to_i32() {
        var ret = wasm.constant_to_i32(this.ptr);
        return ret;
    }
    /**
    * Create from i64
    * @param {I64} v
    * @returns {Constant}
    */
    static from_i64(v) {
        _assertClass(v, I64);
        var ret = wasm.constant_from_i64(v.ptr);
        return Constant.__wrap(ret);
    }
    /**
    * Extract i64 value, returning error if wrong type
    * @returns {I64}
    */
    to_i64() {
        var ret = wasm.constant_to_i64(this.ptr);
        return I64.__wrap(ret);
    }
    /**
    * Create from byte array
    * @param {Uint8Array} v
    * @returns {Constant}
    */
    static from_byte_array(v) {
        var ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.constant_from_byte_array(ptr0, len0);
        return Constant.__wrap(ret);
    }
    /**
    * Extract byte array, returning error if wrong type
    * @returns {Uint8Array}
    */
    to_byte_array() {
        var ret = wasm.constant_to_byte_array(this.ptr);
        return takeObject(ret);
    }
}
/**
* Proof of correctness of tx spending
*/
export class ContextExtension {

    static __wrap(ptr) {
        const obj = Object.create(ContextExtension.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contextextension_free(ptr);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.contextextension_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * get from map or fail if key is missing
    * @param {number} key
    * @returns {Constant}
    */
    get(key) {
        var ret = wasm.contextextension_get(this.ptr, key);
        return Constant.__wrap(ret);
    }
    /**
    * Returns all keys in the map
    * @returns {Uint8Array}
    */
    keys() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contextextension_keys(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* Defines the contract(script) that will be guarding box contents
*/
export class Contract {

    static __wrap(ptr) {
        const obj = Object.create(Contract.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contract_free(ptr);
    }
    /**
    * create new contract that allow spending of the guarded box by a given recipient ([`Address`])
    * @param {Address} recipient
    * @returns {Contract}
    */
    static pay_to_address(recipient) {
        _assertClass(recipient, Address);
        var ret = wasm.contract_pay_to_address(recipient.ptr);
        return Contract.__wrap(ret);
    }
}
/**
* Inputs, that are used to enrich script context, but won't be spent by the transaction
*/
export class DataInput {

    static __wrap(ptr) {
        const obj = Object.create(DataInput.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_datainput_free(ptr);
    }
    /**
    * Get box id
    * @returns {BoxId}
    */
    box_id() {
        var ret = wasm.datainput_box_id(this.ptr);
        return BoxId.__wrap(ret);
    }
}
/**
* DataInput collection
*/
export class DataInputs {

    static __wrap(ptr) {
        const obj = Object.create(DataInputs.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_datainputs_free(ptr);
    }
    /**
    * Create empty DataInputs
    */
    constructor() {
        var ret = wasm.datainputs_new();
        return DataInputs.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.datainputs_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {DataInput}
    */
    get(index) {
        var ret = wasm.datainputs_get(this.ptr, index);
        return DataInput.__wrap(ret);
    }
    /**
    * Adds an elements to the collection
    * @param {DataInput} elem
    */
    add(elem) {
        _assertClass(elem, DataInput);
        wasm.datainputs_add(this.ptr, elem.ptr);
    }
}
/**
* A specified box which is an Oracle Pool box that stores a `Long` integer
* datapoint inside of R4 that represents how many nanoErgs can be bought
* for 1 USD.
*/
export class ErgUsdOraclePoolBox {

    static __wrap(ptr) {
        const obj = Object.create(ErgUsdOraclePoolBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergusdoraclepoolbox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.ergusdoraclepoolbox_w_new(ptr0);
        return ErgUsdOraclePoolBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.ergusdoraclepoolbox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.ergusdoraclepoolbox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.ergusdoraclepoolbox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Extracts the Long datapoint out of register R4.
    * @returns {BigInt}
    */
    datapoint() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.ergusdoraclepoolbox_datapoint(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Extracts the Long datapoint out of register R4.
    * @returns {BigInt}
    */
    datapoint_in_cents() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.ergusdoraclepoolbox_datapoint_in_cents(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* Ergo box, that is taking part in some transaction on the chain
* Differs with [`ErgoBoxCandidate`] by added transaction id and an index in the input of that transaction
*/
export class ErgoBox {

    static __wrap(ptr) {
        const obj = Object.create(ErgoBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergobox_free(ptr);
    }
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
    constructor(value, creation_height, contract, tx_id, index, tokens) {
        _assertClass(value, BoxValue);
        _assertClass(contract, Contract);
        _assertClass(tx_id, TxId);
        _assertClass(tokens, Tokens);
        var ret = wasm.ergobox_new(value.ptr, creation_height, contract.ptr, tx_id.ptr, index, tokens.ptr);
        return ErgoBox.__wrap(ret);
    }
    /**
    * Get box id
    * @returns {BoxId}
    */
    box_id() {
        var ret = wasm.ergobox_box_id(this.ptr);
        return BoxId.__wrap(ret);
    }
    /**
    * Get box creation height
    * @returns {number}
    */
    creation_height() {
        var ret = wasm.ergobox_creation_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * Get tokens for box
    * @returns {Tokens}
    */
    tokens() {
        var ret = wasm.ergobox_tokens(this.ptr);
        return Tokens.__wrap(ret);
    }
    /**
    * Get ergo tree for box
    * @returns {ErgoTree}
    */
    ergo_tree() {
        var ret = wasm.ergobox_ergo_tree(this.ptr);
        return ErgoTree.__wrap(ret);
    }
    /**
    * Get box value in nanoERGs
    * @returns {BoxValue}
    */
    value() {
        var ret = wasm.ergobox_value(this.ptr);
        return BoxValue.__wrap(ret);
    }
    /**
    * Returns value (ErgoTree constant) stored in the register or None if the register is empty
    * @param {number} register_id
    * @returns {Constant | undefined}
    */
    register_value(register_id) {
        var ret = wasm.ergobox_register_value(this.ptr, register_id);
        return ret === 0 ? undefined : Constant.__wrap(ret);
    }
    /**
    * JSON representation
    * @returns {any}
    */
    to_json() {
        var ret = wasm.ergobox_to_json(this.ptr);
        return takeObject(ret);
    }
    /**
    * JSON representation
    * @param {string} json
    * @returns {ErgoBox}
    */
    static from_json(json) {
        var ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.ergobox_from_json(ptr0, len0);
        return ErgoBox.__wrap(ret);
    }
}
/**
* Pair of <value, tokens> for an box
*/
export class ErgoBoxAssetsData {

    static __wrap(ptr) {
        const obj = Object.create(ErgoBoxAssetsData.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergoboxassetsdata_free(ptr);
    }
    /**
    * Create empty SimpleBoxSelector
    * @param {BoxValue} value
    * @param {Tokens} tokens
    */
    constructor(value, tokens) {
        _assertClass(value, BoxValue);
        _assertClass(tokens, Tokens);
        var ret = wasm.ergoboxassetsdata_new(value.ptr, tokens.ptr);
        return ErgoBoxAssetsData.__wrap(ret);
    }
    /**
    * Value part of the box
    * @returns {BoxValue}
    */
    value() {
        var ret = wasm.ergobox_value(this.ptr);
        return BoxValue.__wrap(ret);
    }
    /**
    * Tokens part of the box
    * @returns {Tokens}
    */
    tokens() {
        var ret = wasm.ergoboxassetsdata_tokens(this.ptr);
        return Tokens.__wrap(ret);
    }
}
/**
* List of asset data for a box
*/
export class ErgoBoxAssetsDataList {

    static __wrap(ptr) {
        const obj = Object.create(ErgoBoxAssetsDataList.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergoboxassetsdatalist_free(ptr);
    }
    /**
    * Create empty Tokens
    */
    constructor() {
        var ret = wasm.ergoboxassetsdatalist_new();
        return ErgoBoxAssetsDataList.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.ergoboxassetsdatalist_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {ErgoBoxAssetsData}
    */
    get(index) {
        var ret = wasm.ergoboxassetsdatalist_get(this.ptr, index);
        return ErgoBoxAssetsData.__wrap(ret);
    }
    /**
    * Adds an elements to the collection
    * @param {ErgoBoxAssetsData} elem
    */
    add(elem) {
        _assertClass(elem, ErgoBoxAssetsData);
        wasm.ergoboxassetsdatalist_add(this.ptr, elem.ptr);
    }
}
/**
* ErgoBox candidate not yet included in any transaction on the chain
*/
export class ErgoBoxCandidate {

    static __wrap(ptr) {
        const obj = Object.create(ErgoBoxCandidate.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergoboxcandidate_free(ptr);
    }
    /**
    * Returns value (ErgoTree constant) stored in the register or None if the register is empty
    * @param {number} register_id
    * @returns {Constant | undefined}
    */
    register_value(register_id) {
        var ret = wasm.ergoboxcandidate_register_value(this.ptr, register_id);
        return ret === 0 ? undefined : Constant.__wrap(ret);
    }
    /**
    * Get box creation height
    * @returns {number}
    */
    creation_height() {
        var ret = wasm.ergoboxcandidate_creation_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * Get tokens for box
    * @returns {Tokens}
    */
    tokens() {
        var ret = wasm.ergoboxcandidate_tokens(this.ptr);
        return Tokens.__wrap(ret);
    }
    /**
    * Get ergo tree for box
    * @returns {ErgoTree}
    */
    ergo_tree() {
        var ret = wasm.ergoboxcandidate_ergo_tree(this.ptr);
        return ErgoTree.__wrap(ret);
    }
    /**
    * Get box value in nanoERGs
    * @returns {BoxValue}
    */
    value() {
        var ret = wasm.ergobox_value(this.ptr);
        return BoxValue.__wrap(ret);
    }
}
/**
* ErgoBoxCandidate builder
*/
export class ErgoBoxCandidateBuilder {

    static __wrap(ptr) {
        const obj = Object.create(ErgoBoxCandidateBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergoboxcandidatebuilder_free(ptr);
    }
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
    constructor(value, contract, creation_height) {
        _assertClass(value, BoxValue);
        _assertClass(contract, Contract);
        var ret = wasm.ergoboxcandidatebuilder_new(value.ptr, contract.ptr, creation_height);
        return ErgoBoxCandidateBuilder.__wrap(ret);
    }
    /**
    * Set minimal value (per byte of the serialized box size)
    * @param {number} new_min_value_per_byte
    */
    set_min_box_value_per_byte(new_min_value_per_byte) {
        wasm.ergoboxcandidatebuilder_set_min_box_value_per_byte(this.ptr, new_min_value_per_byte);
    }
    /**
    * Get minimal value (per byte of the serialized box size)
    * @returns {number}
    */
    min_box_value_per_byte() {
        var ret = wasm.ergoboxcandidatebuilder_min_box_value_per_byte(this.ptr);
        return ret >>> 0;
    }
    /**
    * Set new box value
    * @param {BoxValue} new_value
    */
    set_value(new_value) {
        _assertClass(new_value, BoxValue);
        var ptr0 = new_value.ptr;
        new_value.ptr = 0;
        wasm.ergoboxcandidatebuilder_set_value(this.ptr, ptr0);
    }
    /**
    * Get box value
    * @returns {BoxValue}
    */
    value() {
        var ret = wasm.ergoboxcandidatebuilder_value(this.ptr);
        return BoxValue.__wrap(ret);
    }
    /**
    * Calculate serialized box size(in bytes)
    * @returns {number}
    */
    calc_box_size_bytes() {
        var ret = wasm.ergoboxcandidatebuilder_calc_box_size_bytes(this.ptr);
        return ret >>> 0;
    }
    /**
    * Calculate minimal box value for the current box serialized size(in bytes)
    * @returns {BoxValue}
    */
    calc_min_box_value() {
        var ret = wasm.ergoboxcandidatebuilder_calc_min_box_value(this.ptr);
        return BoxValue.__wrap(ret);
    }
    /**
    * Set register with a given id (R4-R9) to the given value
    * @param {number} register_id
    * @param {Constant} value
    */
    set_register_value(register_id, value) {
        _assertClass(value, Constant);
        wasm.ergoboxcandidatebuilder_set_register_value(this.ptr, register_id, value.ptr);
    }
    /**
    * Returns register value for the given register id (R4-R9), or None if the register is empty
    * @param {number} register_id
    * @returns {Constant | undefined}
    */
    register_value(register_id) {
        var ret = wasm.ergoboxcandidatebuilder_register_value(this.ptr, register_id);
        return ret === 0 ? undefined : Constant.__wrap(ret);
    }
    /**
    * Delete register value(make register empty) for the given register id (R4-R9)
    * @param {number} register_id
    */
    delete_register_value(register_id) {
        wasm.ergoboxcandidatebuilder_delete_register_value(this.ptr, register_id);
    }
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
    mint_token(token, token_name, token_desc, num_decimals) {
        _assertClass(token, Token);
        var ptr0 = passStringToWasm0(token_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(token_desc, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.ergoboxcandidatebuilder_mint_token(this.ptr, token.ptr, ptr0, len0, ptr1, len1, num_decimals);
    }
    /**
    * Add given token id and token amount
    * @param {TokenId} token_id
    * @param {TokenAmount} amount
    */
    add_token(token_id, amount) {
        _assertClass(token_id, TokenId);
        _assertClass(amount, TokenAmount);
        wasm.ergoboxcandidatebuilder_add_token(this.ptr, token_id.ptr, amount.ptr);
    }
    /**
    * Build the box candidate
    * @returns {ErgoBoxCandidate}
    */
    build() {
        var ret = wasm.ergoboxcandidatebuilder_build(this.ptr);
        return ErgoBoxCandidate.__wrap(ret);
    }
}
/**
* Collection of ErgoBoxCandidates
*/
export class ErgoBoxCandidates {

    static __wrap(ptr) {
        const obj = Object.create(ErgoBoxCandidates.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergoboxcandidates_free(ptr);
    }
    /**
    * Create new outputs
    * @param {ErgoBoxCandidate} box_candidate
    */
    constructor(box_candidate) {
        _assertClass(box_candidate, ErgoBoxCandidate);
        var ret = wasm.ergoboxcandidates_new(box_candidate.ptr);
        return ErgoBoxCandidates.__wrap(ret);
    }
    /**
    * sometimes it's useful to keep track of an empty list
    * but keep in mind Ergo transactions need at least 1 output
    * @returns {ErgoBoxCandidates}
    */
    static empty() {
        var ret = wasm.ergoboxcandidates_empty();
        return ErgoBoxCandidates.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.ergoboxcandidates_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {ErgoBoxCandidate}
    */
    get(index) {
        var ret = wasm.ergoboxcandidates_get(this.ptr, index);
        return ErgoBoxCandidate.__wrap(ret);
    }
    /**
    * Add an element to the collection
    * @param {ErgoBoxCandidate} b
    */
    add(b) {
        _assertClass(b, ErgoBoxCandidate);
        wasm.ergoboxcandidates_add(this.ptr, b.ptr);
    }
}
/**
* Collection of ErgoBox'es
*/
export class ErgoBoxes {

    static __wrap(ptr) {
        const obj = Object.create(ErgoBoxes.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergoboxes_free(ptr);
    }
    /**
    * parse ErgoBox array from json
    * @param {any[]} boxes
    * @returns {ErgoBoxes}
    */
    static from_boxes_json(boxes) {
        var ptr0 = passArrayJsValueToWasm0(boxes, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.ergoboxes_from_boxes_json(ptr0, len0);
        return ErgoBoxes.__wrap(ret);
    }
    /**
    * Create new collection with one element
    * @param {ErgoBox} b
    */
    constructor(b) {
        _assertClass(b, ErgoBox);
        var ret = wasm.ergoboxes_new(b.ptr);
        return ErgoBoxes.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.ergoboxcandidates_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Add an element to the collection
    * @param {ErgoBox} b
    */
    add(b) {
        _assertClass(b, ErgoBox);
        wasm.ergoboxes_add(this.ptr, b.ptr);
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {ErgoBox}
    */
    get(index) {
        var ret = wasm.ergoboxes_get(this.ptr, index);
        return ErgoBox.__wrap(ret);
    }
}
/**
* TBD
*/
export class ErgoStateContext {

    static __wrap(ptr) {
        const obj = Object.create(ErgoStateContext.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergostatecontext_free(ptr);
    }
    /**
    * empty (dummy) context (for signing P2PK tx only)
    * @returns {ErgoStateContext}
    */
    static dummy() {
        var ret = wasm.ergostatecontext_dummy();
        return ErgoStateContext.__wrap(ret);
    }
}
/**
* The root of ErgoScript IR. Serialized instances of this class are self sufficient and can be passed around.
*/
export class ErgoTree {

    static __wrap(ptr) {
        const obj = Object.create(ErgoTree.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergotree_free(ptr);
    }
    /**
    * Decode from base16 encoded serialized ErgoTree
    * @param {string} s
    * @returns {ErgoTree}
    */
    static from_base16_bytes(s) {
        var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.ergotree_from_base16_bytes(ptr0, len0);
        return ErgoTree.__wrap(ret);
    }
    /**
    * Decode from encoded serialized ErgoTree
    * @param {Uint8Array} data
    * @returns {ErgoTree}
    */
    static from_bytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.ergotree_from_bytes(ptr0, len0);
        return ErgoTree.__wrap(ret);
    }
    /**
    * Encode Ergo tree as serialized bytes
    * @returns {Uint8Array}
    */
    to_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.ergotree_to_bytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* A specified box which is intended to be spent for the Ergs inside.
* The spec simply requires the box to simply have at least `1000000`
* nanoErgs inside.
*/
export class ErgsBox {

    static __wrap(ptr) {
        const obj = Object.create(ErgsBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ergsbox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.ergsbox_w_new(ptr0);
        return ErgsBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.ergsbox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.ergsbox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.ergsbox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* Wrapper for i64 for JS/TS
*/
export class I64 {

    static __wrap(ptr) {
        const obj = Object.create(I64.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_i64_free(ptr);
    }
    /**
    * Create from a standard rust string representation
    * @param {string} string
    * @returns {I64}
    */
    static from_str(string) {
        var ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.i64_from_str(ptr0, len0);
        return I64.__wrap(ret);
    }
    /**
    * String representation of the value for use from environments that don't support i64
    * @returns {string}
    */
    to_str() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.i64_to_str(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Get the value as JS number (64-bit float)
    * @returns {number}
    */
    as_num() {
        var ret = wasm.i64_as_num(this.ptr);
        return takeObject(ret);
    }
    /**
    * Addition with overflow check
    * @param {I64} other
    * @returns {I64}
    */
    checked_add(other) {
        _assertClass(other, I64);
        var ret = wasm.i64_checked_add(this.ptr, other.ptr);
        return I64.__wrap(ret);
    }
}
/**
* Signed inputs used in signed transactions
*/
export class Input {

    static __wrap(ptr) {
        const obj = Object.create(Input.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_input_free(ptr);
    }
    /**
    * Get box id
    * @returns {BoxId}
    */
    box_id() {
        var ret = wasm.input_box_id(this.ptr);
        return BoxId.__wrap(ret);
    }
    /**
    * Get the spending proof
    * @returns {ProverResult}
    */
    spending_proof() {
        var ret = wasm.input_spending_proof(this.ptr);
        return ProverResult.__wrap(ret);
    }
}
/**
* Collection of signed inputs
*/
export class Inputs {

    static __wrap(ptr) {
        const obj = Object.create(Inputs.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_inputs_free(ptr);
    }
    /**
    * Create empty Inputs
    */
    constructor() {
        var ret = wasm.inputs_new();
        return Inputs.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.inputs_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {Input}
    */
    get(index) {
        var ret = wasm.inputs_get(this.ptr, index);
        return Input.__wrap(ret);
    }
}
/**
* helper methods to get the fee address for various networks
*/
export class MinerAddress {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mineraddress_free(ptr);
    }
    /**
    * address to use in mainnet for the fee
    * @returns {string}
    */
    static mainnet_fee_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mineraddress_mainnet_fee_address(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * address to use in testnet for the fee
    * @returns {string}
    */
    static testnet_fee_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mineraddress_testnet_fee_address(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* Combination of an Address with a network
* These two combined together form a base58 encoding
*/
export class NetworkAddress {

    static __wrap(ptr) {
        const obj = Object.create(NetworkAddress.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_networkaddress_free(ptr);
    }
    /**
    * create a new NetworkAddress(address + network prefix) for a given network type
    * @param {number} network
    * @param {Address} address
    * @returns {NetworkAddress}
    */
    static new(network, address) {
        _assertClass(address, Address);
        var ret = wasm.networkaddress_new(network, address.ptr);
        return NetworkAddress.__wrap(ret);
    }
    /**
    * Decode (base58) a NetworkAddress (address + network prefix) from string
    * @param {string} s
    * @returns {NetworkAddress}
    */
    static from_base58(s) {
        var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.networkaddress_from_base58(ptr0, len0);
        return NetworkAddress.__wrap(ret);
    }
    /**
    * Encode (base58) address
    * @returns {string}
    */
    to_base58() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.networkaddress_to_base58(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Decode from a serialized address
    * @param {Uint8Array} data
    * @returns {NetworkAddress}
    */
    static from_bytes(data) {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.networkaddress_from_bytes(ptr0, len0);
        return NetworkAddress.__wrap(ret);
    }
    /**
    * Encode address as serialized bytes
    * @returns {Uint8Array}
    */
    to_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.networkaddress_to_bytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Network for the address
    * @returns {number}
    */
    network() {
        var ret = wasm.networkaddress_network(this.ptr);
        return ret >>> 0;
    }
    /**
    * Get address without network information
    * @returns {Address}
    */
    address() {
        var ret = wasm.networkaddress_address(this.ptr);
        return Address.__wrap(ret);
    }
}
/**
* Proof of correctness of tx spending
*/
export class ProverResult {

    static __wrap(ptr) {
        const obj = Object.create(ProverResult.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_proverresult_free(ptr);
    }
    /**
    * Get proof
    * @returns {Uint8Array}
    */
    proof() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.proverresult_proof(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Get extension
    * @returns {ContextExtension}
    */
    extension() {
        var ret = wasm.proverresult_extension(this.ptr);
        return ContextExtension.__wrap(ret);
    }
    /**
    * JSON representation
    * @returns {any}
    */
    to_json() {
        var ret = wasm.proverresult_to_json(this.ptr);
        return takeObject(ret);
    }
}
/**
* A struct which allows a developer to create a specification of a
* Register in a box. This `RegisterSpec` is used in a `BoxSpec.
*/
export class RegisterSpec {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_registerspec_free(ptr);
    }
}
/**
* A predicated box which holds ReserveCoins
*/
export class ReserveCoinBox {

    static __wrap(ptr) {
        const obj = Object.create(ReserveCoinBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reservecoinbox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.reservecoinbox_w_new(ptr0);
        return ReserveCoinBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.reservecoinbox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.reservecoinbox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.reservecoinbox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Get the amount of tokens within the box
    * @returns {BigInt}
    */
    get token_amount() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reservecoinbox_token_amount(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* Secret key for the prover
*/
export class SecretKey {

    static __wrap(ptr) {
        const obj = Object.create(SecretKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkey_free(ptr);
    }
    /**
    * generate random key
    * @returns {SecretKey}
    */
    static random_dlog() {
        var ret = wasm.secretkey_random_dlog();
        return SecretKey.__wrap(ret);
    }
    /**
    * Parse dlog secret key from bytes (SEC-1-encoded scalar)
    * @param {Uint8Array} bytes
    * @returns {SecretKey}
    */
    static dlog_from_bytes(bytes) {
        var ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.secretkey_dlog_from_bytes(ptr0, len0);
        return SecretKey.__wrap(ret);
    }
    /**
    * Address (encoded public image)
    * @returns {Address}
    */
    get_address() {
        var ret = wasm.secretkey_get_address(this.ptr);
        return Address.__wrap(ret);
    }
    /**
    * Encode from a serialized key
    * @returns {Uint8Array}
    */
    to_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkey_to_bytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* SecretKey collection
*/
export class SecretKeys {

    static __wrap(ptr) {
        const obj = Object.create(SecretKeys.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkeys_free(ptr);
    }
    /**
    * Create empty SecretKeys
    */
    constructor() {
        var ret = wasm.secretkeys_new();
        return SecretKeys.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.secretkeys_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {SecretKey}
    */
    get(index) {
        var ret = wasm.secretkeys_get(this.ptr, index);
        return SecretKey.__wrap(ret);
    }
    /**
    * Adds an elements to the collection
    * @param {SecretKey} elem
    */
    add(elem) {
        _assertClass(elem, SecretKey);
        wasm.secretkeys_add(this.ptr, elem.ptr);
    }
}
/**
* Naive box selector, collects inputs until target balance is reached
*/
export class SimpleBoxSelector {

    static __wrap(ptr) {
        const obj = Object.create(SimpleBoxSelector.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_simpleboxselector_free(ptr);
    }
    /**
    * Create empty SimpleBoxSelector
    */
    constructor() {
        var ret = wasm.simpleboxselector_new();
        return SimpleBoxSelector.__wrap(ret);
    }
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
    select(inputs, target_balance, target_tokens) {
        _assertClass(inputs, ErgoBoxes);
        _assertClass(target_balance, BoxValue);
        _assertClass(target_tokens, Tokens);
        var ret = wasm.simpleboxselector_select(this.ptr, inputs.ptr, target_balance.ptr, target_tokens.ptr);
        return BoxSelection.__wrap(ret);
    }
}
/**
* A predicated box which holds StableCoins
*/
export class StableCoinBox {

    static __wrap(ptr) {
        const obj = Object.create(StableCoinBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stablecoinbox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.stablecoinbox_w_new(ptr0);
        return StableCoinBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.stablecoinbox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.stablecoinbox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.stablecoinbox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * Get the amount of tokens within the box
    * @returns {BigInt}
    */
    get token_amount() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinbox_token_amount(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
* The struct which represents our multi-stage smart contract protocol
*/
export class StableCoinProtocol {

    static __wrap(ptr) {
        const obj = Object.create(StableCoinProtocol.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stablecoinprotocol_free(ptr);
    }
    /**
    * Create a new StableCoinProtocol
    */
    constructor() {
        var ret = wasm.stablecoinprotocol_new();
        return StableCoinProtocol.__wrap(ret);
    }
    /**
    * @returns {BigInt}
    */
    get min_box_value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinprotocol_min_box_value(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {BigInt}
    */
    get reservecoin_default_price() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinprotocol_reservecoin_default_price(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {BigInt}
    */
    get min_reserve_ratio() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinprotocol_min_reserve_ratio(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {BigInt}
    */
    get max_reserve_ratio() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinprotocol_max_reserve_ratio(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    get stablecoin_token_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinprotocol_stablecoin_token_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get reservecoin_token_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinprotocol_reservecoin_token_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get bank_nft_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.stablecoinprotocol_bank_nft_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
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
    w_assembler_mint_reservecoin(amount_to_mint, user_address, transaction_fee, current_height, oracle_box, bank_box, total_input_nano_ergs, implementor_address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            uint64CvtShim[0] = transaction_fee;
            const low2 = u32CvtShim[0];
            const high2 = u32CvtShim[1];
            uint64CvtShim[0] = current_height;
            const low3 = u32CvtShim[0];
            const high3 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            _assertClass(bank_box, BankBox);
            uint64CvtShim[0] = total_input_nano_ergs;
            const low4 = u32CvtShim[0];
            const high4 = u32CvtShim[1];
            var ptr5 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len5 = WASM_VECTOR_LEN;
            wasm.stablecoinprotocol_w_assembler_mint_reservecoin(retptr, this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, low4, high4, ptr5, len5);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
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
    w_assembler_mint_stablecoin(amount_to_mint, user_address, transaction_fee, current_height, oracle_box, bank_box, total_input_nano_ergs, implementor_address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_to_mint;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            uint64CvtShim[0] = transaction_fee;
            const low2 = u32CvtShim[0];
            const high2 = u32CvtShim[1];
            uint64CvtShim[0] = current_height;
            const low3 = u32CvtShim[0];
            const high3 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            _assertClass(bank_box, BankBox);
            uint64CvtShim[0] = total_input_nano_ergs;
            const low4 = u32CvtShim[0];
            const high4 = u32CvtShim[1];
            var ptr5 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len5 = WASM_VECTOR_LEN;
            wasm.stablecoinprotocol_w_assembler_mint_stablecoin(retptr, this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, low4, high4, ptr5, len5);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
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
    w_assembler_redeem_reservecoin(amount_being_redeemed, user_address, transaction_fee, current_height, oracle_box, bank_box, implementor_address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_being_redeemed;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            uint64CvtShim[0] = transaction_fee;
            const low2 = u32CvtShim[0];
            const high2 = u32CvtShim[1];
            uint64CvtShim[0] = current_height;
            const low3 = u32CvtShim[0];
            const high3 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            _assertClass(bank_box, BankBox);
            var ptr4 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len4 = WASM_VECTOR_LEN;
            wasm.stablecoinprotocol_w_assembler_redeem_reservecoin(retptr, this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, ptr4, len4);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
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
    w_assembler_redeem_stablecoin(amount_being_redeemed, user_address, transaction_fee, current_height, oracle_box, bank_box, implementor_address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = amount_being_redeemed;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            uint64CvtShim[0] = transaction_fee;
            const low2 = u32CvtShim[0];
            const high2 = u32CvtShim[1];
            uint64CvtShim[0] = current_height;
            const low3 = u32CvtShim[0];
            const high3 = u32CvtShim[1];
            _assertClass(oracle_box, ErgUsdOraclePoolBox);
            _assertClass(bank_box, BankBox);
            var ptr4 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len4 = WASM_VECTOR_LEN;
            wasm.stablecoinprotocol_w_assembler_redeem_stablecoin(retptr, this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, ptr4, len4);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
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
    w_action_mint_reservecoin(amount_to_mint, user_address, transaction_fee, current_height, oracle_box, bank_box, ergo_boxes, implementor_address) {
        uint64CvtShim[0] = amount_to_mint;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        uint64CvtShim[0] = transaction_fee;
        const low2 = u32CvtShim[0];
        const high2 = u32CvtShim[1];
        uint64CvtShim[0] = current_height;
        const low3 = u32CvtShim[0];
        const high3 = u32CvtShim[1];
        _assertClass(oracle_box, ErgUsdOraclePoolBox);
        _assertClass(bank_box, BankBox);
        _assertClass(ergo_boxes, ErgoBoxes);
        var ptr4 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len4 = WASM_VECTOR_LEN;
        var ret = wasm.stablecoinprotocol_w_action_mint_reservecoin(this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, ergo_boxes.ptr, ptr4, len4);
        return UnsignedTransaction.__wrap(ret);
    }
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
    w_action_mint_stablecoin(amount_to_mint, user_address, transaction_fee, current_height, oracle_box, bank_box, ergo_boxes, implementor_address) {
        uint64CvtShim[0] = amount_to_mint;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        uint64CvtShim[0] = transaction_fee;
        const low2 = u32CvtShim[0];
        const high2 = u32CvtShim[1];
        uint64CvtShim[0] = current_height;
        const low3 = u32CvtShim[0];
        const high3 = u32CvtShim[1];
        _assertClass(oracle_box, ErgUsdOraclePoolBox);
        _assertClass(bank_box, BankBox);
        _assertClass(ergo_boxes, ErgoBoxes);
        var ptr4 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len4 = WASM_VECTOR_LEN;
        var ret = wasm.stablecoinprotocol_w_action_mint_stablecoin(this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, ergo_boxes.ptr, ptr4, len4);
        return UnsignedTransaction.__wrap(ret);
    }
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
    w_action_redeem_reservecoin(amount_to_redeem, user_address, transaction_fee, current_height, oracle_box, bank_box, rc_boxes, implementor_address) {
        uint64CvtShim[0] = amount_to_redeem;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        uint64CvtShim[0] = transaction_fee;
        const low2 = u32CvtShim[0];
        const high2 = u32CvtShim[1];
        uint64CvtShim[0] = current_height;
        const low3 = u32CvtShim[0];
        const high3 = u32CvtShim[1];
        _assertClass(oracle_box, ErgUsdOraclePoolBox);
        _assertClass(bank_box, BankBox);
        _assertClass(rc_boxes, ErgoBoxes);
        var ptr4 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len4 = WASM_VECTOR_LEN;
        var ret = wasm.stablecoinprotocol_w_action_redeem_reservecoin(this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, rc_boxes.ptr, ptr4, len4);
        return UnsignedTransaction.__wrap(ret);
    }
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
    w_action_redeem_stablecoin(amount_to_redeem, user_address, transaction_fee, current_height, oracle_box, bank_box, sc_boxes, implementor_address) {
        uint64CvtShim[0] = amount_to_redeem;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ptr1 = passStringToWasm0(user_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        uint64CvtShim[0] = transaction_fee;
        const low2 = u32CvtShim[0];
        const high2 = u32CvtShim[1];
        uint64CvtShim[0] = current_height;
        const low3 = u32CvtShim[0];
        const high3 = u32CvtShim[1];
        _assertClass(oracle_box, ErgUsdOraclePoolBox);
        _assertClass(bank_box, BankBox);
        _assertClass(sc_boxes, ErgoBoxes);
        var ptr4 = passStringToWasm0(implementor_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len4 = WASM_VECTOR_LEN;
        var ret = wasm.stablecoinprotocol_w_action_redeem_stablecoin(this.ptr, low0, high0, ptr1, len1, low2, high2, low3, high3, oracle_box.ptr, bank_box.ptr, sc_boxes.ptr, ptr4, len4);
        return UnsignedTransaction.__wrap(ret);
    }
}
/**
* Token represented with token id paired with it's amount
*/
export class Token {

    static __wrap(ptr) {
        const obj = Object.create(Token.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_token_free(ptr);
    }
    /**
    * Create a token with given token id and amount
    * @param {TokenId} token_id
    * @param {TokenAmount} amount
    */
    constructor(token_id, amount) {
        _assertClass(token_id, TokenId);
        _assertClass(amount, TokenAmount);
        var ret = wasm.token_new(token_id.ptr, amount.ptr);
        return Token.__wrap(ret);
    }
    /**
    * Get token id
    * @returns {TokenId}
    */
    id() {
        var ret = wasm.token_id(this.ptr);
        return TokenId.__wrap(ret);
    }
    /**
    * Get token amount
    * @returns {TokenAmount}
    */
    amount() {
        var ret = wasm.token_amount(this.ptr);
        return TokenAmount.__wrap(ret);
    }
    /**
    * JSON representation
    * @returns {any}
    */
    to_json() {
        var ret = wasm.token_to_json(this.ptr);
        return takeObject(ret);
    }
}
/**
* Token amount with bound checks
*/
export class TokenAmount {

    static __wrap(ptr) {
        const obj = Object.create(TokenAmount.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tokenamount_free(ptr);
    }
    /**
    * Create from i64 with bounds check
    * @param {I64} v
    * @returns {TokenAmount}
    */
    static from_i64(v) {
        _assertClass(v, I64);
        var ret = wasm.tokenamount_from_i64(v.ptr);
        return TokenAmount.__wrap(ret);
    }
    /**
    * Get value as signed 64-bit long (I64)
    * @returns {I64}
    */
    as_i64() {
        var ret = wasm.tokenamount_as_i64(this.ptr);
        return I64.__wrap(ret);
    }
}
/**
* Token id (32 byte digest)
*/
export class TokenId {

    static __wrap(ptr) {
        const obj = Object.create(TokenId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tokenid_free(ptr);
    }
    /**
    * Create token id from erbo box id (32 byte digest)
    * @param {BoxId} box_id
    * @returns {TokenId}
    */
    static from_box_id(box_id) {
        _assertClass(box_id, BoxId);
        var ret = wasm.tokenid_from_box_id(box_id.ptr);
        return TokenId.__wrap(ret);
    }
    /**
    * Parse token id (32 byte digets) from base16-encoded string
    * @param {string} str
    * @returns {TokenId}
    */
    static from_str(str) {
        var ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.tokenid_from_str(ptr0, len0);
        return TokenId.__wrap(ret);
    }
    /**
    * Base16 encoded string
    * @returns {string}
    */
    to_str() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tokenid_to_str(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* A struct which allows a developer to create a specification of a
* token in a box. This `TokenSpec` is used in a `BoxSpec.
*/
export class TokenSpec {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tokenspec_free(ptr);
    }
}
/**
* Array of tokens
*/
export class Tokens {

    static __wrap(ptr) {
        const obj = Object.create(Tokens.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tokens_free(ptr);
    }
    /**
    * Create empty Tokens
    */
    constructor() {
        var ret = wasm.tokens_new();
        return Tokens.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.tokens_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {Token}
    */
    get(index) {
        var ret = wasm.tokens_get(this.ptr, index);
        return Token.__wrap(ret);
    }
    /**
    * Adds an elements to the collection
    * @param {Token} elem
    */
    add(elem) {
        _assertClass(elem, Token);
        wasm.tokens_add(this.ptr, elem.ptr);
    }
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

    static __wrap(ptr) {
        const obj = Object.create(Transaction.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_transaction_free(ptr);
    }
    /**
    * Get id for transaction
    * @returns {TxId}
    */
    id() {
        var ret = wasm.transaction_id(this.ptr);
        return TxId.__wrap(ret);
    }
    /**
    * JSON representation
    * @returns {any}
    */
    to_json() {
        var ret = wasm.transaction_to_json(this.ptr);
        return takeObject(ret);
    }
    /**
    * Inputs for transaction
    * @returns {Inputs}
    */
    inputs() {
        var ret = wasm.transaction_inputs(this.ptr);
        return Inputs.__wrap(ret);
    }
    /**
    * Data inputs for transaction
    * @returns {DataInputs}
    */
    data_inputs() {
        var ret = wasm.transaction_data_inputs(this.ptr);
        return DataInputs.__wrap(ret);
    }
    /**
    * Outputs for transaction
    * @returns {ErgoBoxCandidates}
    */
    outputs() {
        var ret = wasm.transaction_outputs(this.ptr);
        return ErgoBoxCandidates.__wrap(ret);
    }
}
/**
* This is a struct which is used to generate Ergo Tx Assembler Spec `String`s
* from `UnsignedTransaction`s.
*/
export class TxAssemblerSpecBuilder {

    static __wrap(ptr) {
        const obj = Object.create(TxAssemblerSpecBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txassemblerspecbuilder_free(ptr);
    }
    /**
    * WASM wrapper for `new()`
    * @param {UnsignedTransaction} wrapped_unsigned_tx
    * @returns {TxAssemblerSpecBuilder}
    */
    static w_new(wrapped_unsigned_tx) {
        _assertClass(wrapped_unsigned_tx, UnsignedTransaction);
        var ptr0 = wrapped_unsigned_tx.ptr;
        wrapped_unsigned_tx.ptr = 0;
        var ret = wasm.txassemblerspecbuilder_w_new(ptr0);
        return TxAssemblerSpecBuilder.__wrap(ret);
    }
    /**
    * Create a placeholder box that holds an amount of nanoErgs equal to the
    * input `nano_ergs` value and then wrap said box as a `ErgsBox`.
    * This is useful for using with protocols as a placeholder so that
    * an assembler spec can be created (and this placeholder box thrown out
    * and replaced with the user's actual input box from the assembler)
    * @param {BigInt} nano_ergs
    * @returns {ErgsBox | undefined}
    */
    static create_placeholder_ergs_box(nano_ergs) {
        uint64CvtShim[0] = nano_ergs;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm.txassemblerspecbuilder_create_placeholder_ergs_box(low0, high0);
        return ret === 0 ? undefined : ErgsBox.__wrap(ret);
    }
    /**
    * Builds a JSON `String` which
    * is formatted as a transaction spec for working with the
    * Ergo Transaction Assembler Service.
    * @param {BigInt} transaction_fee
    * @returns {string}
    */
    build_assembler_spec(transaction_fee) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            uint64CvtShim[0] = transaction_fee;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            wasm.txassemblerspecbuilder_build_assembler_spec(retptr, this.ptr, low0, high0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* Unsigned transaction builder
*/
export class TxBuilder {

    static __wrap(ptr) {
        const obj = Object.create(TxBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txbuilder_free(ptr);
    }
    /**
    * Suggested transaction fee (semi-default value used across wallets and dApps as of Oct 2020)
    * @returns {BoxValue}
    */
    static SUGGESTED_TX_FEE() {
        var ret = wasm.txbuilder_SUGGESTED_TX_FEE();
        return BoxValue.__wrap(ret);
    }
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
    static new(box_selection, output_candidates, current_height, fee_amount, change_address, min_change_value) {
        _assertClass(box_selection, BoxSelection);
        _assertClass(output_candidates, ErgoBoxCandidates);
        _assertClass(fee_amount, BoxValue);
        _assertClass(change_address, Address);
        _assertClass(min_change_value, BoxValue);
        var ret = wasm.txbuilder_new(box_selection.ptr, output_candidates.ptr, current_height, fee_amount.ptr, change_address.ptr, min_change_value.ptr);
        return TxBuilder.__wrap(ret);
    }
    /**
    * Set transaction's data inputs
    * @param {DataInputs} data_inputs
    */
    set_data_inputs(data_inputs) {
        _assertClass(data_inputs, DataInputs);
        wasm.txbuilder_set_data_inputs(this.ptr, data_inputs.ptr);
    }
    /**
    * Build the unsigned transaction
    * @returns {UnsignedTransaction}
    */
    build() {
        var ret = wasm.txbuilder_build(this.ptr);
        return UnsignedTransaction.__wrap(ret);
    }
    /**
    * Get inputs
    * @returns {BoxSelection}
    */
    box_selection() {
        var ret = wasm.txbuilder_box_selection(this.ptr);
        return BoxSelection.__wrap(ret);
    }
    /**
    * Get data inputs
    * @returns {DataInputs}
    */
    data_inputs() {
        var ret = wasm.txbuilder_data_inputs(this.ptr);
        return DataInputs.__wrap(ret);
    }
    /**
    * Get outputs EXCLUDING fee and change
    * @returns {ErgoBoxCandidates}
    */
    output_candidates() {
        var ret = wasm.txbuilder_output_candidates(this.ptr);
        return ErgoBoxCandidates.__wrap(ret);
    }
    /**
    * Get current height
    * @returns {number}
    */
    current_height() {
        var ret = wasm.txbuilder_current_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * Get fee amount
    * @returns {BoxValue}
    */
    fee_amount() {
        var ret = wasm.txbuilder_fee_amount(this.ptr);
        return BoxValue.__wrap(ret);
    }
    /**
    * Get change
    * @returns {Address}
    */
    change_address() {
        var ret = wasm.txbuilder_change_address(this.ptr);
        return Address.__wrap(ret);
    }
    /**
    * Get min change value
    * @returns {BoxValue}
    */
    min_change_value() {
        var ret = wasm.txbuilder_min_change_value(this.ptr);
        return BoxValue.__wrap(ret);
    }
}
/**
* Transaction id
*/
export class TxId {

    static __wrap(ptr) {
        const obj = Object.create(TxId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_txid_free(ptr);
    }
    /**
    * Zero (empty) transaction id (to use as dummy value in tests)
    * @returns {TxId}
    */
    static zero() {
        var ret = wasm.txid_zero();
        return TxId.__wrap(ret);
    }
    /**
    * get the tx id as bytes
    * @returns {string}
    */
    to_str() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.txid_to_str(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * convert a hex string into a TxId
    * @param {string} s
    * @returns {TxId}
    */
    static from_str(s) {
        var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.txid_from_str(ptr0, len0);
        return TxId.__wrap(ret);
    }
}
/**
* Unsigned inputs used in constructing unsigned transactions
*/
export class UnsignedInput {

    static __wrap(ptr) {
        const obj = Object.create(UnsignedInput.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unsignedinput_free(ptr);
    }
    /**
    * Get box id
    * @returns {BoxId}
    */
    box_id() {
        var ret = wasm.unsignedinput_box_id(this.ptr);
        return BoxId.__wrap(ret);
    }
    /**
    * Get extension
    * @returns {ContextExtension}
    */
    extension() {
        var ret = wasm.unsignedinput_extension(this.ptr);
        return ContextExtension.__wrap(ret);
    }
}
/**
* Collection of unsigned signed inputs
*/
export class UnsignedInputs {

    static __wrap(ptr) {
        const obj = Object.create(UnsignedInputs.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unsignedinputs_free(ptr);
    }
    /**
    * Create empty UnsignedInputs
    */
    constructor() {
        var ret = wasm.inputs_new();
        return UnsignedInputs.__wrap(ret);
    }
    /**
    * Returns the number of elements in the collection
    * @returns {number}
    */
    len() {
        var ret = wasm.inputs_len(this.ptr);
        return ret >>> 0;
    }
    /**
    * Returns the element of the collection with a given index
    * @param {number} index
    * @returns {UnsignedInput}
    */
    get(index) {
        var ret = wasm.unsignedinputs_get(this.ptr, index);
        return UnsignedInput.__wrap(ret);
    }
}
/**
* Unsigned (inputs without proofs) transaction
*/
export class UnsignedTransaction {

    static __wrap(ptr) {
        const obj = Object.create(UnsignedTransaction.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_unsignedtransaction_free(ptr);
    }
    /**
    * Get id for transaction
    * @returns {TxId}
    */
    id() {
        var ret = wasm.unsignedtransaction_id(this.ptr);
        return TxId.__wrap(ret);
    }
    /**
    * Inputs for transaction
    * @returns {UnsignedInputs}
    */
    inputs() {
        var ret = wasm.unsignedtransaction_inputs(this.ptr);
        return UnsignedInputs.__wrap(ret);
    }
    /**
    * Data inputs for transaction
    * @returns {DataInputs}
    */
    data_inputs() {
        var ret = wasm.transaction_data_inputs(this.ptr);
        return DataInputs.__wrap(ret);
    }
    /**
    * Outputs for transaction
    * @returns {ErgoBoxCandidates}
    */
    outputs() {
        var ret = wasm.transaction_outputs(this.ptr);
        return ErgoBoxCandidates.__wrap(ret);
    }
    /**
    * JSON representation
    * @returns {any}
    */
    to_json() {
        var ret = wasm.unsignedtransaction_to_json(this.ptr);
        return takeObject(ret);
    }
    /**
    * JSON representation
    * @param {string} json
    * @returns {UnsignedTransaction}
    */
    static from_json(json) {
        var ptr0 = passStringToWasm0(json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.unsignedtransaction_from_json(ptr0, len0);
        return UnsignedTransaction.__wrap(ret);
    }
}
/**
* The box which holds the Update NFT & the address to be used to
* update the protocol in R4.
*/
export class UpdateBox {

    static __wrap(ptr) {
        const obj = Object.create(UpdateBox.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_updatebox_free(ptr);
    }
    /**
    * @param {ErgoBox} ergo_box
    */
    constructor(ergo_box) {
        _assertClass(ergo_box, ErgoBox);
        var ptr0 = ergo_box.ptr;
        ergo_box.ptr = 0;
        var ret = wasm.updatebox_w_new(ptr0);
        return UpdateBox.__wrap(ret);
    }
    /**
    * @returns {BoxSpec}
    */
    w_box_spec() {
        var ret = wasm.updatebox_w_box_spec(this.ptr);
        return BoxSpec.__wrap(ret);
    }
    /**
    * @param {string} explorer_response_body
    * @returns {any[]}
    */
    static w_process_explorer_response(explorer_response_body) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_response_body, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.updatebox_w_process_explorer_response(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} explorer_api_url
    * @returns {string}
    */
    static w_explorer_endpoint(explorer_api_url) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(explorer_api_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.updatebox_w_explorer_endpoint(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
* A collection of secret keys. This simplified signing by matching the secret keys to the correct inputs automatically.
*/
export class Wallet {

    static __wrap(ptr) {
        const obj = Object.create(Wallet.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wallet_free(ptr);
    }
    /**
    * Create wallet instance loading secret key from mnemonic
    * @param {string} _mnemonic_phrase
    * @param {string} _mnemonic_pass
    * @returns {Wallet}
    */
    static from_mnemonic(_mnemonic_phrase, _mnemonic_pass) {
        var ptr0 = passStringToWasm0(_mnemonic_phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(_mnemonic_pass, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.wallet_from_mnemonic(ptr0, len0, ptr1, len1);
        return Wallet.__wrap(ret);
    }
    /**
    * Create wallet using provided secret key
    * @param {SecretKeys} secret
    * @returns {Wallet}
    */
    static from_secrets(secret) {
        _assertClass(secret, SecretKeys);
        var ret = wasm.wallet_from_secrets(secret.ptr);
        return Wallet.__wrap(ret);
    }
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
    sign_transaction(_state_context, tx, boxes_to_spend, data_boxes) {
        _assertClass(_state_context, ErgoStateContext);
        _assertClass(tx, UnsignedTransaction);
        _assertClass(boxes_to_spend, ErgoBoxes);
        _assertClass(data_boxes, ErgoBoxes);
        var ret = wasm.wallet_sign_transaction(this.ptr, _state_context.ptr, tx.ptr, boxes_to_spend.ptr, data_boxes.ptr);
        return Transaction.__wrap(ret);
    }
}

export const __wbg_bankbox_new = function(arg0) {
    var ret = BankBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbg_reservecoinbox_new = function(arg0) {
    var ret = ReserveCoinBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbg_stablecoinbox_new = function(arg0) {
    var ret = StableCoinBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbg_ballotbox_new = function(arg0) {
    var ret = BallotBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbg_updatebox_new = function(arg0) {
    var ret = UpdateBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbg_ergsbox_new = function(arg0) {
    var ret = ErgsBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbg_ergusdoraclepoolbox_new = function(arg0) {
    var ret = ErgUsdOraclePoolBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbg_adausdoraclepoolbox_new = function(arg0) {
    var ret = AdaUsdOraclePoolBox.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_json_parse = function(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbindgen_json_serialize = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_number_new = function(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbg_self_86b4b13392c7af56 = handleError(function() {
    var ret = self.self;
    return addHeapObject(ret);
});

export const __wbg_static_accessor_MODULE_452b4680e8614c81 = function() {
    var ret = module;
    return addHeapObject(ret);
};

export const __wbg_require_f5521a5b85ad2542 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
};

export const __wbg_crypto_b8c92eaac23d0d80 = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export const __wbg_msCrypto_9ad6677321a08dd8 = function(arg0) {
    var ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export const __wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export const __wbg_getRandomValues_dd27e6b0652b3236 = function(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

export const __wbg_getRandomValues_e57c9b75ddead065 = function(arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
};

export const __wbg_randomFillSync_d2ba53160aec6aba = function(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

export const __wbg_buffer_0be9fb426f2dd82b = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export const __wbg_newwithbyteoffsetandlength_85b7ce82b001ea08 = function(arg0, arg1, arg2) {
    var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_length_3a5138f465b971ad = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export const __wbg_new_4e8d18dbf9cd5240 = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_set_4769de301eb521d7 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export const __wbg_newwithlength_19241666d161c55f = function(arg0) {
    var ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_subarray_b07d46fd5261d77f = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbindgen_is_string = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

export const __wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

export const __wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

