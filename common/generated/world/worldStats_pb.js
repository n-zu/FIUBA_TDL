/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.worldStats.v1.WorldStats', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.worldStats.v1.WorldStats = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.worldStats.v1.WorldStats, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.worldStats.v1.WorldStats.displayName = 'proto.worldStats.v1.WorldStats';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.worldStats.v1.WorldStats.prototype.toObject = function(opt_includeInstance) {
  return proto.worldStats.v1.WorldStats.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.worldStats.v1.WorldStats} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.worldStats.v1.WorldStats.toObject = function(includeInstance, msg) {
  var f, obj = {
    rage: +jspb.Message.getFieldWithDefault(msg, 1, 0.0),
    kills: jspb.Message.getFieldWithDefault(msg, 2, 0),
    killsperplayerMap: (f = msg.getKillsperplayerMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.worldStats.v1.WorldStats}
 */
proto.worldStats.v1.WorldStats.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.worldStats.v1.WorldStats;
  return proto.worldStats.v1.WorldStats.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.worldStats.v1.WorldStats} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.worldStats.v1.WorldStats}
 */
proto.worldStats.v1.WorldStats.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setRage(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setKills(value);
      break;
    case 3:
      var value = msg.getKillsperplayerMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readUint32, null, "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.worldStats.v1.WorldStats.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.worldStats.v1.WorldStats.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.worldStats.v1.WorldStats} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.worldStats.v1.WorldStats.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRage();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getKills();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getKillsperplayerMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeUint32);
  }
};


/**
 * optional float rage = 1;
 * @return {number}
 */
proto.worldStats.v1.WorldStats.prototype.getRage = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.worldStats.v1.WorldStats.prototype.setRage = function(value) {
  jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional uint32 kills = 2;
 * @return {number}
 */
proto.worldStats.v1.WorldStats.prototype.getKills = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.worldStats.v1.WorldStats.prototype.setKills = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * map<string, uint32> killsPerPlayer = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,number>}
 */
proto.worldStats.v1.WorldStats.prototype.getKillsperplayerMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,number>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


proto.worldStats.v1.WorldStats.prototype.clearKillsperplayerMap = function() {
  this.getKillsperplayerMap().clear();
};


goog.object.extend(exports, proto.worldStats.v1);
