
// https://www.vertex42.com/ExcelTips/unicode-symbols.html



const numberRange = (startInt, endInt ) => {
  let result = [];
  for ( let i = startInt; i <= endInt; i++) {
    result.push(i);
  }
  return result;
}


const emoticons = numberRange( 128512, 128591 );

const supplemental = numberRange( 129292, 129535 );

const transport = numberRange( 128640, 128767 );

const arrows = [
  129154,
  11207,
  11208,
  11160,
  11162,
  11164,
  11166,
  11104,
  11106,
  8666,
  8667,
  8674,
  8649,
  11144,
  11146,
  ... numberRange( 8592, 8703 ),
  ... numberRange( 129024, 129159 ),
];

const misc = [
  9729,
  9752,
  9765,
  9776,
  9777,
  9778,
  9779,
  9780,
  9781,
  9782,
  9783,
  9818,
  9819,
  9820,
  9821,
  9822,
  9835,
  9839,
  9850,
  9873,
  9875,
  9924,
  9925,
  9935,
  9940,
  9947,
  9969,
  9971,
  9974,
  9982,

];

const dingbats = [
  9992,
  9993,
  9995,
  9996,
  10003,
  10004,
  10008,
  10022,
  10032,
  10033,
  10034,
  10035,
  10036,
  10037,
  10038,
  10039,
  10040,
  10041,
  10042,
  10060,
  10067,
  10068,
  10069,
  10071,
  10084,
  10085,
  10096,
  10097,
  10102,
  10103,
  10104,
  10105,
  10106,
  10107,
  10108,
  10109,
  10110,
  10111,
];


const emojis = numberRange( 127744, 128511 );

const box = numberRange( 9472, 9599 );

const punct = [
  ...numberRange(33, 47),
  ...numberRange(58, 64),
  ...numberRange(91, 96),
  ...numberRange(123, 139),
  ...numberRange(145, 153),
  ...numberRange(161, 191),
  ...numberRange(8208, 8231),
  ...numberRange(8242, 8286),
];

const geometric = [
  ...numberRange( 9632, 9727 ),
  ...numberRange( 128896, 129023 ),
]

export const iconsByType = {
  arrows: arrows,
  punctuation: punct,
  box: box,
  geometric: geometric,
  emojis: emojis,
  emoticons: emoticons,
  dingbats: dingbats,
  misc: misc,
  supplemental: supplemental,
  transport: transport,
}

const main = [
  ...arrows,
  ...box,
  ...emojis,
  ...emoticons,
  ...dingbats,
  ...misc,
]

export const unicodeCharNums = [
  ...main,
];


const dim = 0;
const dimMax = 100;

const bright = 150;
const brightMax = 255;

export const SVGColors = [
  `rgb(${bright} ${bright} ${brightMax})`,
  `rgb(${bright} ${brightMax} ${bright})`,
  `rgb(${brightMax} ${bright} ${bright})`,
  `rgb(${bright} ${brightMax} ${brightMax})`,
  `rgb(${brightMax} ${bright} ${brightMax})`,
  `rgb(${brightMax} ${brightMax} ${bright})`,
  `rgb(${dim} ${dim} ${dimMax})`,
  `rgb(${dim} ${dimMax} ${dim})`,
  `rgb(${dimMax} ${dim} ${dim})`,
  `rgb(${dim} ${dimMax} ${dimMax})`,
  `rgb(${dimMax} ${dim} ${dimMax})`,
  `rgb(${dimMax} ${dimMax} ${dim})`,
  'black',
  'white',
  'blue',
  'cyan',
  'green',
  'gray',
  'magenta',
  'orange',
  'red',
  'yellow',
];


export default {};