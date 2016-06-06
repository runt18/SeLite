"use strict";
var text= "Hello my friend. How are you today?...........................................................................................................................................................................................................................................";
btoa(text).indexOf("\r")

var encoded= "%89%50%4e%47%0d%0a%1a%0a%00%00%00%0d%49%48%44%52%00%00%00%01%00%00%00%01%08%06%00%00%00%1f%15%c4%89%00%00%00%01%73%52%47%42%00%ae%ce%1c%e9%00%00%00%04%67%41%4d%41%00%00%b1%8f%0b%fc%61%05%00%00%00%09%70%48%59%73%00%00%0e%c4%00%00%0e%c4%01%95%2b%0e%1b%00%00%00%0d%49%44%41%54%18%57%63%f8%ff%ff%ff%7f%00%09%fb%03%fd%05%43%45%ca%00%00%00%00%49%45%4e%44%ae%42%60%82";
var base64= btoa(encoded);
base64.indexOf("\n")
var back= atob(base64);
encoded===back // -> true

var decoded= decodeURIComponent( encoded );
var recoded= encodeURIComponent( decoded );
encoded===recoded


for( var code=0; code<256*256; code++ ) {
  var char= String.fromCharCode( code );
  
  var url= encodeURIComponent( char );
  if( decodeURIComponent(url)!==char ) {
    throw new Error( "Code " +code+ ": " +char+ " URL-encoded as " +url );
  }
  
  var base64= btoa(char);
  if( atob(base64)!==char ) {
    throw new Error( "Code " +code+ ": " +char+ " base64-encoded as " +url );
  }
}
/*
Exception: InvalidCharacterError: String contains an invalid character
@Scratchpad/1:11:0
*/

//1x1png data:image/png,
var good= "%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15%C4%89%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%00%0DIDAT%18Wc%F8%FF%FF%FF%7F%00%09%FB%03%FD%05CE%CA%00%00%00%00IEND%AEB%60%82";
var  php= "%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15%C4%89%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%00%0DIDAT%18Wc%F8%FF%FF%FF%7F%00%09%FB%03%FD%05CE%CA%00%00%00%00IEND%AEB%60%82";

// 1x1png, with two-space hexadecimals:
var spac= "%C2%89%89P%50N%4eG%47%0D%0d%0A%0a%1A%1a%0A%0a%00%00%00%00%00%00%0D%0dI%49H%48D%44R%52%00%00%00%00%00%00%01%01%00%00%00%00%00%00%01%01%08%08%06%06%00%00%00%00%00%00%1F%1f%15%15%C3%84%c4%C2%89%89%00%00%00%00%00%00%01%01s%73R%52G%47B%42%00%00%C2%AE%ae%C3%8E%ce%1C%1c%C3%A9%e9%00%00%00%00%00%00%04%04g%67A%41M%4dA%41%00%00%00%00%C2%B1%b1%C2%8F%8f%0B%0b%C3%BC%fca%61%05%05%00%00%00%00%00%00%09%09p%70H%48Y%59s%73%00%00%00%00%0E%0e%C3%84%c4%00%00%00%00%0E%0e%C3%84%c4%01%01%C2%95%95%2B%2b%0E%0e%1B%1b%00%00%00%00%00%00%0D%0dI%49D%44A%41T%54%18%18W%57c%63%C3%B8%f8%C3%BF%ff%C3%BF%ff%C3%BF%ff%7F%7f%00%00%09%09%C3%BB%fb%03%03%C3%BD%fd%05%05C%43E%45%C3%8A%ca%00%00%00%00%00%00%00%00I%49E%45N%4eD%44%C2%AE%aeB%42%60%60%C2%82%82"

// encodeURIComponent( sum of String.fromCharCode(stringView.bufferView[i]) )
var sick= "%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15Ä%C2%89%00%00%00%01sRGB%00®Î%1Cé%00%00%00%04gAMA%00%00±%C2%8F%0Büa%05%00%00%00%09pHYs%00%00%0EÄ%00%00%0EÄ%01%C2%95%2B%0E%1B%00%00%00%0DIDAT%18Wcøÿÿÿ%7F%00%09û%03ý%05CEÊ%00%00%00%00IEND®B`%C2%82";
//    %89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15 %C4%89%00%00%00%01sRGB%00%AE  %CE%1C %E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%00%0DIDAT%18Wc%F8%FF%FF%FF%7F%00%09%FB%03%FD%05CE%CA%00%00%00%00IEND%AEB%60%82";
// %C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15Ä%C2%89%00%00%00%01sRGB%00   ®Î   %1Cé   %00%00%00%04gAMA%00%00±%C2%8F%0Büa%05%00%00%00%09pHYs%00%00%0EÄ%00%00%0EÄ%01%C2%95%2B%0E%1B%00%00%00%0DIDAT%18Wcøÿÿÿ%7F%00%09û%03ý%05CEÊ%00%00%00%00IEND®B`%C2%82";

// sum of ( '%' +( stringView.bufferView[i] ).toString(16).toUpperCase() )
var sick= "%89%50%4E%47%D%A%1A%A%0%0%0%D%49%48%44%52%0%0%0%1%0%0%0%1%8%6%0%0%0%1F%15%C4%89%0%0%0%1%73%52%47%42%0%AE%CE%1C%E9%0%0%0%4%67%41%4D%41%0%0%B1%8F%B%FC%61%5%0%0%0%9%70%48%59%73%0%0%E%C4%0%0%E%C4%1%95%2B%E%1B%0%0%0%D%49%44%41%54%18%57%63%F8%FF%FF%FF%7F%0%9%FB%3%FD%5%43%45%CA%0%0%0%0%49%45%4E%44%AE%42%60%82";

// sum of ( encodeURIComponent( String.fromCharCode(stringView.bufferView[i]) ) )
var sick= "%C2%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15Ä%C2%89%00%00%00%01sRGB%00®Î%1Cé%00%00%00%04gAMA%00%00±%C2%8F%0Büa%05%00%00%00%09pHYs%00%00%0EÄ%00%00%0EÄ%01%C2%95%2B%0E%1B%00%00%00%0DIDAT%18Wcøÿÿÿ%7F%00%09û%03ý%05CEÊ%00%00%00%00IEND®B`%C2%82";

// php -r "echo rawurlencode( fread( fopen('/var/www/html/pkehl/small_1x1.png', 'r'), 200 ) );"
//%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15%C4%89%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%00%0DIDAT%18Wc%F8%FF%FF%FF%7F%00%09%FB%03%FD%05CE%CA%00%00%00%00IEND%AEB%60%82
decodeURIComponent( "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%01%00%00%00%01%08%06%00%00%00%1F%15%C4%89%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%04gAMA%00%00%B1%8F%0B%FCa%05%00%00%00%09pHYs%00%00%0E%C4%00%00%0E%C4%01%95%2B%0E%1B%00%00%00%0DIDAT%18Wc%F8%FF%FF%FF%7F%00%09%FB%03%FD%05CE%CA%00%00%00%00IEND%AEB%60%82")

//----
if( false ) {
  var css= '.image-decorated {    list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAHQSURBVFhHxZbRdYMwDEVNvztEDp2gG5D/Nit1pqYDwAadoMkS/ad+wo8IRwbHkPSe48TIjp4k2zhV73H/yBM+uq5zVVVNGmyPQCoAQYtHFEcqQCCoG7lrhbwQlKRZtG07jscNY2uZBGA5pT0mZb8F1zdDAHGWOoiUUMqeyyAeAgCpILTNaiVQvP5868dN2DSN86Lhybn9fh96afT8XCo3+K2Pz/I9HkM4QxBi9M8AwbJ/Pp/dbreTfila/PT9K/2xAjkZryHOnCy+iHDereCkOsFp7+aXwsoc9B/tUAFrLWmL9waA+Mvx/bKOQcAilTnEQdFlBHFkUr8OTk+HIau4EqnM8bufw5f0J6/iW4FTCcSoRCpzLQ6Kr2NWgcAxK0HmMifFFYAjLgHQlQBLmZPiCmh0NeKgQEocSAVwDFNH0SKer6tB0RxxMHkPWMWwxlLzrX0xJw42DaCExU0IEQpBmOIgfi765+Sdw7u0JTgvbsQaQ/Nv0jDjmsUArDHa/A0pDUDE8mH9XrPqTagpvU0324S0pbB8g80qMId12474yGSNQvcKa4w2vQf0PNpyuEsFbvrrhijwZTU9ptFzOMZTYI3NsVkAIA4ih01uw3Kc+wOqvDRi9YDe3AAAAABJRU5ErkJggg==");}';
  btoa(css)
  /*
  LmltYWdlLWRlY29yYXRlZCB7ICAgIGxpc3Qtc3R5bGUtaW1hZ2U6IHVybCgiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDQUFBQUFnQ0FZQUFBQnplbnIwQUFBQUFYTlNSMElBcnM0YzZRQUFBQVJuUVUxQkFBQ3hqd3Y4WVFVQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUhRU1VSQlZGaEh4WmJSZFlNd0RFVk52enRFRHAyZ0c1RC9OaXQxcHFZRHdBYWRvTWtTL2FkK3dvOElSd2JIa1BTZTQ4VElqcDRrMnpoVjczSC95Qk0rdXE1elZWVk5HbXlQUUNvQVFZdEhGRWNxUUNDb0c3bHJoYndRbEtSWnRHMDdqc2NOWTJ1WkJHQTVwVDBtWmI4RjF6ZERBSEdXT29pVVVNcWV5eUFlQWdDcElMVE5haVZRdlA1ODY4ZE4yRFNOODZMaHlibjlmaDk2YWZUOFhDbzMrSzJQei9JOUhrTTRReEJpOU04QXdiSi9QcC9kYnJlVGZpbGEvUFQ5Sy8yeEFqa1pyeUhPbkN5K2lIRGVyZUNrT3NGcDcrYVh3c29jOUIvdFVBRnJMV21MOXdhQStNdngvYktPUWNBaWxUbkVRZEZsQkhGa1VyOE9UaytISWF1NEVxbk04YnVmdzVmMEo2L2lXNEZUQ2NTb1JDcHpMUTZLcjJOV2djQXhLMEhtTWlmRkZZQWpMZ0hRbFFCTG1aUGlDbWgwTmVLZ1FFb2NTQVZ3REZOSDBTS2VyNnRCMFJ4eE1Ia1BXTVd3eGxMenJYMHhKdzQyRGFDRXhVMElFUXBCbU9JZ2ZpNzY1K1Nkdzd1MEpUZ3Zic1FhUS9OdjBqRGptc1VBckRIYS9BMHBEVURFOG1IOVhyUHFUYWdwdlUwMzI0UzBwYkI4ZzgwcU1JZDEyNDc0eUdTTlF2Y0thNHcydlFmMFBOcHl1RXNGYnZycmhpandaVFU5cHRGek9NWlRZSTNOc1ZrQUlBNGloMDF1dzNLYyt3T3F2RFJpOVlEZTNBQUFBQUJKUlU1RXJrSmdnZz09Iik7fQ==
  */   
  atob( btoa( css) )===css
  atob( btoa( css) ) // ok

  var html= '<html><head>  <script type="text/javascript" src="data:text/plain;base64,InVzZSBzdHJpY3QiOwpmdW5jdGlvbiBzaW1wbGUoIG1lc3NhZ2UgKSB7CiAgICBhbGVydCggbWVzc2FnZSApOwp9Cg=="></script>  <link rel="stylesheet" href="data:text/css;base64,LmltYWdlLWRlY29yYXRlZCB7CiAgICBsaXN0LXN0eWxlLWltYWdlOiB1cmwoImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4DQpqd3Y4WVFVQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUhRU1VSQlZGaEh4WmJSZFlNd0RFVk52enRFRHAyZ0c1RC9OaXQxDQpwcVlEd0FhZG9Na1MvYWQrd284SVJ3YkhrUFNlNDhUSWpwNGsyemhWNzNIL3lCTSt1cTV6VlZWTkdteVBRQ29BUVl0SEZFY3FRQ0NvDQpHN2xyaGJ3UWxLUlp0RzA3anNjTlkydVpCR0E1cFQwbVpiOEYxemREQUhHV09vaVVVTXFleXlBZUFnQ3BJTFROYWlWUXZQNTg2OGRODQoyRFNOODZMaHlibjlmaDk2YWZUOFhDbzMrSzJQei9JOUhrTTRReEJpOU04QXdiSi9QcC9kYnJlVGZpbGEvUFQ5Sy8yeEFqa1pyeUhPDQpuQ3kraUhEZXJlQ2tPc0ZwNythWHdzb2M5Qi90VUFGckxXbUw5d2FBK012eC9iS09RY0FpbFRuRVFkRmxCSEZrVXI4T1RrK0hJYXU0DQpFcW5NOGJ1Znc1ZjBKNi9pVzRGVENjU29SQ3B6TFE2S3IyTldnY0F4SzBIbU1pZkZGWUFqTGdIUWxRQkxtWlBpQ21oME5lS2dRRW9jDQpTQVZ3REZOSDBTS2VyNnRCMFJ4eE1Ia1BXTVd3eGxMenJYMHhKdzQyRGFDRXhVMElFUXBCbU9JZ2ZpNzY1K1Nkdzd1MEpUZ3Zic1FhDQpRL052MGpEam1zVUFyREhhL0EwcERVREU4bUg5WHJQcVRhZ3B2VTAzMjRTMHBiQjhnODBxTUlkMTI0NzR5R1NOUXZjS2E0dzJ2UWYwDQpQTnB5dUVzRmJ2cnJoaWp3WlRVOXB0RnpPTVpUWUkzTnNWa0FJQTRpaDAxdXczS2Mrd09xdkRSaTlZRGUzQUFBQUFCSlJVNUVya0pnDQpnZz09Iik7Cn0K" /></head><body>    <ul class="image-decorated">        <li><a href="javascript:simple(%22Hi%22)">call a function from a local JS file</a></li>    </ul></body></html>'
  atob( btoa( html) )===html

  css_in_html= 'LmltYWdlLWRlY29yYXRlZCB7CiAgICBsaXN0LXN0eWxlLWltYWdlOiB1cmwoImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4DQpqd3Y4WVFVQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUhRU1VSQlZGaEh4WmJSZFlNd0RFVk52enRFRHAyZ0c1RC9OaXQxDQpwcVlEd0FhZG9Na1MvYWQrd284SVJ3YkhrUFNlNDhUSWpwNGsyemhWNzNIL3lCTSt1cTV6VlZWTkdteVBRQ29BUVl0SEZFY3FRQ0NvDQpHN2xyaGJ3UWxLUlp0RzA3anNjTlkydVpCR0E1cFQwbVpiOEYxemREQUhHV09vaVVVTXFleXlBZUFnQ3BJTFROYWlWUXZQNTg2OGRODQoyRFNOODZMaHlibjlmaDk2YWZUOFhDbzMrSzJQei9JOUhrTTRReEJpOU04QXdiSi9QcC9kYnJlVGZpbGEvUFQ5Sy8yeEFqa1pyeUhPDQpuQ3kraUhEZXJlQ2tPc0ZwNythWHdzb2M5Qi90VUFGckxXbUw5d2FBK012eC9iS09RY0FpbFRuRVFkRmxCSEZrVXI4T1RrK0hJYXU0DQpFcW5NOGJ1Znc1ZjBKNi9pVzRGVENjU29SQ3B6TFE2S3IyTldnY0F4SzBIbU1pZkZGWUFqTGdIUWxRQkxtWlBpQ21oME5lS2dRRW9jDQpTQVZ3REZOSDBTS2VyNnRCMFJ4eE1Ia1BXTVd3eGxMenJYMHhKdzQyRGFDRXhVMElFUXBCbU9JZ2ZpNzY1K1Nkdzd1MEpUZ3Zic1FhDQpRL052MGpEam1zVUFyREhhL0EwcERVREU4bUg5WHJQcVRhZ3B2VTAzMjRTMHBiQjhnODBxTUlkMTI0NzR5R1NOUXZjS2E0dzJ2UWYwDQpQTnB5dUVzRmJ2cnJoaWp3WlRVOXB0RnpPTVpUWUkzTnNWa0FJQTRpaDAxdXczS2Mrd09xdkRSaTlZRGUzQUFBQUFCSlJVNUVya0pnDQpnZz09Iik7Cn0K';
  atob( css_in_html)
}