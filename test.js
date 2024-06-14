let data = "```json\n{\n  \"2021 Revenue\": \"$1,375 million\",\n  \"2021 EBITDA\": \"$186 million\",\n  \"2021 EBITDA MARGIN\": \"13.5%\",\n  \"2021 TOTAL DEBT\": \"$1,950 million\",\n  \"2021 DEBT/EBITDA\": \"10.48\",\n  \"2022 Revenue\": \"$1,480 million\",\n  \"2022 EBITDA\": \"$195 million\",\n  \"2022 EBITDA MARGIN\": \"13.2%\",\n  \"2022 TOTAL DEBT\": \"$1,900 million\",\n  \"2022 DEBT/EBITDA\": \"9.74\",\n  \"2023 Revenue\": \"$1,550 million\",\n  \"2023 EBITDA\": \"$210 million\",\n  \"2023 EBITDA MARGIN\": \"13.5%\",\n  \"2023 TOTAL DEBT\": \"$1,850 million\",\n  \"2023 DEBT/EBITDA\": \"8.81\"\n}\n```"
let data2 = '```json\n{\n  "Fastening Systems": "Hillman Group provides a wide range of fastening solutions including screws, bolts, nuts, washers, anchors, nails, and rivets, catering to various industries and retail customers.",\n  "Hardware Solutions": "The company offers innovative hardware solutions designed for home improvement, construction, and industrial applications. This includes tools, keys, letters, numbers, signs, and accessories.",\n  "Workplace Safety and Personal Protection": "Hillman Group supplies products that ensure workplace safety and personal protection, including safety gear and protective equipment.",\n  "Merchandising Solutions": "Hillman provides merchandising solutions that help retailers enhance their product displays and improve customer experiences. This includes customized displays, packaging, and inventory management solutions."\n}\n```';
let data3 = '```json\n{\n    "PARTNERS": {\n        "American Nurses Foundation": "Healthcare Segment"\n    },\n    "CUSTOMERS": {\n        "26,000 Retailers": "Home Improvement Retail Segment"\n    }\n}\n```\n\nThe Hillman Group has notable partners like the American Nurses Foundation in the healthcare segment and serves 26,000 retailers in the home improvement retail segment【10:0†source】【10:1†source】.';


let response = data3
.replace(/\\"/g, '"')
.replace(/\\n/g, '\n')
.replace(/\n/g, '')
.replace(/^```json/, '')
.replace(/```$/, '');

response = JSON.parse(response);
console.log('response from extractors api: ', response);