const plist = require("../lib/plist");
const { UID } = require("../lib/plist/bplist/types");
const testObject = {
  hi: 'there',
  test0: new UID(0),
  test3: new UID(3),
  test5: new UID(5),
  test4: new UID(4),
  test65535: new UID(65535),
  test65536: new UID(65536),
  testMAX: new UID(4294967295),
  hello: 'there',
};


const bplistBuffer = plist.createBinary(testObject);
console.log(plist.parse(bplistBuffer));
