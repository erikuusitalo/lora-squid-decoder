// An advanced decoder for use on The Things Network.



//new function code could be added

var ewattchSensor = {

  "0x00": ["temperature", 2, function (i) {
    return signed16(i[1] | i[2] << 8) / 100
  }],

  "0x04": ["humidity", 1, function (i) {
    return i[1] / 2
  }],

  "0x48": ["energy", 36, function (i) {
    return [((i[1]) | (i[2] << 8) | (i[3] << 16)) * 10, ((i[4]) | (i[5] << 8) | (i[6] << 16)) * 10, ((i[7]) | (i[8] << 8) | (i[9] << 16)) * 10, ((i[10]) | (i[11] << 8) | (i[12] << 16)) * 10, ((i[13]) | (i[14] << 8) | (i[15] << 16)) * 10, ((i[16]) | (i[17] << 8) | (i[18] << 16)) * 10, ((i[19]) | (i[20] << 8) | (i[21] << 16)) * 10, ((i[22]) | (i[23] << 8) | (i[24] << 16)) * 10, ((i[25]) | (i[26] << 8) | (i[27] << 16)) * 10, ((i[28]) | (i[29] << 8) | (i[30] << 16)) * 10, ((i[31]) | (i[32] << 8) | (i[33] << 16)) * 10, ((i[34]) | (i[35] << 8) | (i[36] << 16)) * 10]
  }]

};



function Decode(fport, bytes) {

  var decoded = {};

  if (bytes[0] === 0x00)

  {

    bytes = bytes.slice(2) //removing first two bytes

    while (bytes.length > 0) {

      var offset = [0, 1][bytes[0] & 0x01]; // Calculate the length of the offset value to remove it

      // Nodejs can handle integer property names but TTN javascript can't, so convert everything to string

      var properties = ewattchSensor[(bytes[0] & 0xfe).toString(16).padStart(4, "0x00")]; // Find a matching id value from bits 1-8

      if (offset) {

        var varCount = 2;

        while (decoded.hasOwnProperty(properties[0] + varCount)) {

          varCount += 1;

        }

      } else {

        var varCount = '';

      }

      bytes = bytes.slice(offset)

      decoded[properties[0] + varCount] = properties[2](bytes); // Select the right decoder and append to decoded

      bytes = bytes.slice(properties[1] + 1); // Remove the decoded info to bring the next section to the front

    }

  }

  return decoded;

}



function signed16(num) {

  if (num & 0x8000) {

    num -= 0x10000

  }

  return num

}



function signed8(num) {

  if (num & 0x80) {

    num -= 0x100

  }

  return num

}







if (!String.prototype.padStart) {

  String.prototype.padStart = function padStart(targetLength, padString) {

    targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;

    padString = String((typeof padString !== 'undefined' ? padString : ' '));

    if (this.length > targetLength) {

      return String(this);

    } else {

      targetLength = targetLength - this.length;

      if (targetLength > padString.length) {

        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed

      }

      return padString.slice(0, targetLength) + String(this);

    }

  };

}