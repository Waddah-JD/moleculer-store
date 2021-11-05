import RedisAdapter from "./redis";
import { InvalidValueType } from "../errors";

describe("Redis Adapter", () => {
  describe("counstructor", () => {
    it("should be created with required 'public' methods", () => {
      const adapter = new RedisAdapter();

      expect(adapter).toBeDefined();
      expect(adapter).toBeInstanceOf(RedisAdapter);
      expect(adapter.init).toBeInstanceOf(Function);
      expect(adapter.connect).toBeInstanceOf(Function);
      expect(adapter.disconnect).toBeInstanceOf(Function);
      expect(adapter.exists).toBeInstanceOf(Function);
      expect(adapter.get).toBeInstanceOf(Function);
      expect(adapter.set).toBeInstanceOf(Function);
      expect(adapter.delete).toBeInstanceOf(Function);
      expect(adapter.keys).toBeInstanceOf(Function);
      expect(adapter.values).toBeInstanceOf(Function);
      expect(adapter.clear).toBeInstanceOf(Function);
      expect(adapter.size).toBeInstanceOf(Function);
      expect(adapter.serialize).toBeInstanceOf(Function);
      expect(adapter.deserialize).toBeInstanceOf(Function);
    });
  });

  describe("helper methods", () => {
    const adapter = new RedisAdapter();

    describe("serialize", () => {
      it("should throw an error if passed value is not acceptable", () => {
        expect(() => {
          adapter.serialize(undefined);
        }).toThrow(InvalidValueType);
        expect(() => {
          adapter.serialize(function () {
            return "";
          });
        }).toThrow(InvalidValueType);
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          adapter.serialize();
        }).toThrow(InvalidValueType);
      });

      it("should return the same value if a string is pssed", () => {
        expect(adapter.serialize("")).toEqual("");
        expect(adapter.serialize("xxx")).toEqual("xxx");
        expect(adapter.serialize("undefined")).toEqual("undefined");
        expect(adapter.serialize("0")).toEqual("0");
        expect(adapter.serialize("1e2")).toEqual("1e2");
      });

      it("should parse a number into a string", () => {
        expect(adapter.serialize(0)).toEqual("0");
        expect(adapter.serialize(1)).toEqual("1");
        expect(adapter.serialize(1e3)).toEqual("1000");
        expect(adapter.serialize(69)).toEqual("69");
      });

      it("should parse a boolean into a string", () => {
        expect(adapter.serialize(false)).toEqual("false");
        expect(adapter.serialize(true)).toEqual("true");
      });

      it("should parse an object into a JSON format string", () => {
        expect(adapter.serialize({})).toEqual("{}");
        expect(adapter.serialize({ cool: true })).toEqual('{"cool":true}');
        expect(adapter.serialize({ nullVal: null, undefinedVal: undefined })).toEqual('{"nullVal":null}');
        expect(adapter.serialize({ x: "1", y: 1, z: true })).toEqual('{"x":"1","y":1,"z":true}');
        expect(adapter.serialize({ x: "1", y: 1, z: true, first: { second: { third: "enough" } } })).toEqual(
          '{"x":"1","y":1,"z":true,"first":{"second":{"third":"enough"}}}'
        );
      });

      it("should parse an array into a string", () => {
        expect(adapter.serialize([])).toStrictEqual("[]");
        expect(adapter.serialize([1, true, {}, "something"])).toStrictEqual('[1,true,{},"something"]');
      });
    });

    describe("deserialize", () => {
      it("should deserialize numeric strings", () => {
        expect(adapter.deserialize("0")).toEqual(0);
        expect(adapter.deserialize("1e2")).toEqual(100);
        expect(adapter.deserialize("100")).toEqual(100);
        expect(adapter.deserialize("69.0")).toEqual(69);
      });

      it("should deserialize boolean strings", () => {
        expect(adapter.deserialize("true")).toEqual(true);
        expect(adapter.deserialize("false")).toEqual(false);
      });

      it("should return parsed JSON if value is a stringifies JSON", () => {
        expect(adapter.deserialize("{}")).toEqual({});
        expect(adapter.deserialize("[]")).toEqual([]);
        expect(
          adapter.deserialize(
            '{"x":"1","y":1,"z":true,"first":{"second":{"third":"enough","someArr":["1",true,{"final":0}]}}}'
          )
        ).toStrictEqual({
          x: "1",
          y: 1,
          z: true,
          first: { second: { third: "enough", someArr: ["1", true, { final: 0 }] } },
        });
      });

      it("should do nothing if value is already a valid string", () => {
        expect(adapter.deserialize("{")).toEqual("{");
        expect(adapter.deserialize("")).toEqual("");
        expect(adapter.deserialize("xxx")).toEqual("xxx");
      });
    });
  });
});
