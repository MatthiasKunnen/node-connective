import {sanitizeConnectiveName} from './sanitize.util';

const allowedCharacters = [
    ' ', // 0x0020 SPACE
    '!', // 0x0021 EXCLAMATION MARK
    '"', // 0x0022 QUOTATION MARK
    '#', // 0x0023 NUMBER SIGN
    '$', // 0x0024 DOLLAR SIGN
    '%', // 0x0025 PERCENT SIGN
    '&', // 0x0026 AMPERSAND
    '\'', // 0x0027 APOSTROPHE
    '(', // 0x0028 LEFT PARENTHESIS
    ')', // 0x0029 RIGHT PARENTHESIS
    '+', // 0x002B PLUS SIGN
    ',', // 0x002C COMMA
    '-', // 0x002D HYPHEN-MINUS
    '.', // 0x002E FULL STOP
    '0', // 0x0030 DIGIT ZERO
    '1', // 0x0031 DIGIT ONE
    '2', // 0x0032 DIGIT TWO
    '3', // 0x0033 DIGIT THREE
    '4', // 0x0034 DIGIT FOUR
    '5', // 0x0035 DIGIT FIVE
    '6', // 0x0036 DIGIT SIX
    '7', // 0x0037 DIGIT SEVEN
    '8', // 0x0038 DIGIT EIGHT
    '9', // 0x0039 DIGIT NINE
    ';', // 0x003B SEMICOLON
    '=', // 0x003D EQUALS SIGN
    '@', // 0x0040 COMMERCIAL AT
    'A', // 0x0041 LATIN CAPITAL LETTER A
    'B', // 0x0042 LATIN CAPITAL LETTER B
    'C', // 0x0043 LATIN CAPITAL LETTER C
    'D', // 0x0044 LATIN CAPITAL LETTER D
    'E', // 0x0045 LATIN CAPITAL LETTER E
    'F', // 0x0046 LATIN CAPITAL LETTER F
    'G', // 0x0047 LATIN CAPITAL LETTER G
    'H', // 0x0048 LATIN CAPITAL LETTER H
    'I', // 0x0049 LATIN CAPITAL LETTER I
    'J', // 0x004A LATIN CAPITAL LETTER J
    'K', // 0x004B LATIN CAPITAL LETTER K
    'L', // 0x004C LATIN CAPITAL LETTER L
    'M', // 0x004D LATIN CAPITAL LETTER M
    'N', // 0x004E LATIN CAPITAL LETTER N
    'O', // 0x004F LATIN CAPITAL LETTER O
    'P', // 0x0050 LATIN CAPITAL LETTER P
    'Q', // 0x0051 LATIN CAPITAL LETTER Q
    'R', // 0x0052 LATIN CAPITAL LETTER R
    'S', // 0x0053 LATIN CAPITAL LETTER S
    'T', // 0x0054 LATIN CAPITAL LETTER T
    'U', // 0x0055 LATIN CAPITAL LETTER U
    'V', // 0x0056 LATIN CAPITAL LETTER V
    'W', // 0x0057 LATIN CAPITAL LETTER W
    'X', // 0x0058 LATIN CAPITAL LETTER X
    'Y', // 0x0059 LATIN CAPITAL LETTER Y
    'Z', // 0x005A LATIN CAPITAL LETTER Z
    '[', // 0x005B LEFT SQUARE BRACKET
    ']', // 0x005D RIGHT SQUARE BRACKET
    '^', // 0x005E CIRCUMFLEX ACCENT
    '_', // 0x005F LOW LINE
    '`', // 0x0060 GRAVE ACCENT
    'a', // 0x0061 LATIN SMALL LETTER A
    'b', // 0x0062 LATIN SMALL LETTER B
    'c', // 0x0063 LATIN SMALL LETTER C
    'd', // 0x0064 LATIN SMALL LETTER D
    'e', // 0x0065 LATIN SMALL LETTER E
    'f', // 0x0066 LATIN SMALL LETTER F
    'g', // 0x0067 LATIN SMALL LETTER G
    'h', // 0x0068 LATIN SMALL LETTER H
    'i', // 0x0069 LATIN SMALL LETTER I
    'j', // 0x006A LATIN SMALL LETTER J
    'k', // 0x006B LATIN SMALL LETTER K
    'l', // 0x006C LATIN SMALL LETTER L
    'm', // 0x006D LATIN SMALL LETTER M
    'n', // 0x006E LATIN SMALL LETTER N
    'o', // 0x006F LATIN SMALL LETTER O
    'p', // 0x0070 LATIN SMALL LETTER P
    'q', // 0x0071 LATIN SMALL LETTER Q
    'r', // 0x0072 LATIN SMALL LETTER R
    's', // 0x0073 LATIN SMALL LETTER S
    't', // 0x0074 LATIN SMALL LETTER T
    'u', // 0x0075 LATIN SMALL LETTER U
    'v', // 0x0076 LATIN SMALL LETTER V
    'w', // 0x0077 LATIN SMALL LETTER W
    'x', // 0x0078 LATIN SMALL LETTER X
    'y', // 0x0079 LATIN SMALL LETTER Y
    'z', // 0x007A LATIN SMALL LETTER Z
    '{', // 0x007B LEFT CURLY BRACKET
    '}', // 0x007D RIGHT CURLY BRACKET
    '~', // 0x007E TILDE
    ' ', // 0x00A0 NO-BREAK SPACE
    '¡', // 0x00A1 INVERTED EXCLAMATION MARK
    '¢', // 0x00A2 CENT SIGN
    '£', // 0x00A3 POUND SIGN
    '€', // 0x20AC EURO SIGN
    '¥', // 0x00A5 YEN SIGN
    'Š', // 0x0160 LATIN CAPITAL LETTER S WITH CARON
    '§', // 0x00A7 SECTION SIGN
    'š', // 0x0161 LATIN SMALL LETTER S WITH CARON
    '©', // 0x00A9 COPYRIGHT SIGN
    'ª', // 0x00AA FEMININE ORDINAL INDICATOR
    '«', // 0x00AB LEFT-POINTING DOUBLE ANGLE QUOTATION MARK
    '¬', // 0x00AC NOT SIGN
    '­', // 0x00AD SOFT HYPHEN
    '®', // 0x00AE REGISTERED SIGN
    '¯', // 0x00AF MACRON
    '°', // 0x00B0 DEGREE SIGN
    '±', // 0x00B1 PLUS-MINUS SIGN
    '²', // 0x00B2 SUPERSCRIPT TWO
    '³', // 0x00B3 SUPERSCRIPT THREE
    'Ž', // 0x017D LATIN CAPITAL LETTER Z WITH CARON
    'µ', // 0x00B5 MICRO SIGN
    '¶', // 0x00B6 PILCROW SIGN
    '·', // 0x00B7 MIDDLE DOT
    'ž', // 0x017E LATIN SMALL LETTER Z WITH CARON
    '¹', // 0x00B9 SUPERSCRIPT ONE
    'º', // 0x00BA MASCULINE ORDINAL INDICATOR
    '»', // 0x00BB RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK
    'Œ', // 0x0152 LATIN CAPITAL LIGATURE OE
    'œ', // 0x0153 LATIN SMALL LIGATURE OE
    'Ÿ', // 0x0178 LATIN CAPITAL LETTER Y WITH DIAERESIS
    '¿', // 0x00BF INVERTED QUESTION MARK
    'À', // 0x00C0 LATIN CAPITAL LETTER A WITH GRAVE
    'Á', // 0x00C1 LATIN CAPITAL LETTER A WITH ACUTE
    'Â', // 0x00C2 LATIN CAPITAL LETTER A WITH CIRCUMFLEX
    'Ã', // 0x00C3 LATIN CAPITAL LETTER A WITH TILDE
    'Ä', // 0x00C4 LATIN CAPITAL LETTER A WITH DIAERESIS
    'Å', // 0x00C5 LATIN CAPITAL LETTER A WITH RING ABOVE
    'Æ', // 0x00C6 LATIN CAPITAL LETTER AE
    'Ç', // 0x00C7 LATIN CAPITAL LETTER C WITH CEDILLA
    'È', // 0x00C8 LATIN CAPITAL LETTER E WITH GRAVE
    'É', // 0x00C9 LATIN CAPITAL LETTER E WITH ACUTE
    'Ê', // 0x00CA LATIN CAPITAL LETTER E WITH CIRCUMFLEX
    'Ë', // 0x00CB LATIN CAPITAL LETTER E WITH DIAERESIS
    'Ì', // 0x00CC LATIN CAPITAL LETTER I WITH GRAVE
    'Í', // 0x00CD LATIN CAPITAL LETTER I WITH ACUTE
    'Î', // 0x00CE LATIN CAPITAL LETTER I WITH CIRCUMFLEX
    'Ï', // 0x00CF LATIN CAPITAL LETTER I WITH DIAERESIS
    'Ð', // 0x00D0 LATIN CAPITAL LETTER ETH
    'Ñ', // 0x00D1 LATIN CAPITAL LETTER N WITH TILDE
    'Ò', // 0x00D2 LATIN CAPITAL LETTER O WITH GRAVE
    'Ó', // 0x00D3 LATIN CAPITAL LETTER O WITH ACUTE
    'Ô', // 0x00D4 LATIN CAPITAL LETTER O WITH CIRCUMFLEX
    'Õ', // 0x00D5 LATIN CAPITAL LETTER O WITH TILDE
    'Ö', // 0x00D6 LATIN CAPITAL LETTER O WITH DIAERESIS
    '×', // 0x00D7 MULTIPLICATION SIGN
    'Ø', // 0x00D8 LATIN CAPITAL LETTER O WITH STROKE
    'Ù', // 0x00D9 LATIN CAPITAL LETTER U WITH GRAVE
    'Ú', // 0x00DA LATIN CAPITAL LETTER U WITH ACUTE
    'Û', // 0x00DB LATIN CAPITAL LETTER U WITH CIRCUMFLEX
    'Ü', // 0x00DC LATIN CAPITAL LETTER U WITH DIAERESIS
    'Ý', // 0x00DD LATIN CAPITAL LETTER Y WITH ACUTE
    'Þ', // 0x00DE LATIN CAPITAL LETTER THORN
    'ß', // 0x00DF LATIN SMALL LETTER SHARP S
    'à', // 0x00E0 LATIN SMALL LETTER A WITH GRAVE
    'á', // 0x00E1 LATIN SMALL LETTER A WITH ACUTE
    'â', // 0x00E2 LATIN SMALL LETTER A WITH CIRCUMFLEX
    'ã', // 0x00E3 LATIN SMALL LETTER A WITH TILDE
    'ä', // 0x00E4 LATIN SMALL LETTER A WITH DIAERESIS
    'å', // 0x00E5 LATIN SMALL LETTER A WITH RING ABOVE
    'æ', // 0x00E6 LATIN SMALL LETTER AE
    'ç', // 0x00E7 LATIN SMALL LETTER C WITH CEDILLA
    'è', // 0x00E8 LATIN SMALL LETTER E WITH GRAVE
    'é', // 0x00E9 LATIN SMALL LETTER E WITH ACUTE
    'ê', // 0x00EA LATIN SMALL LETTER E WITH CIRCUMFLEX
    'ë', // 0x00EB LATIN SMALL LETTER E WITH DIAERESIS
    'ì', // 0x00EC LATIN SMALL LETTER I WITH GRAVE
    'í', // 0x00ED LATIN SMALL LETTER I WITH ACUTE
    'î', // 0x00EE LATIN SMALL LETTER I WITH CIRCUMFLEX
    'ï', // 0x00EF LATIN SMALL LETTER I WITH DIAERESIS
    'ð', // 0x00F0 LATIN SMALL LETTER ETH
    'ñ', // 0x00F1 LATIN SMALL LETTER N WITH TILDE
    'ò', // 0x00F2 LATIN SMALL LETTER O WITH GRAVE
    'ó', // 0x00F3 LATIN SMALL LETTER O WITH ACUTE
    'ô', // 0x00F4 LATIN SMALL LETTER O WITH CIRCUMFLEX
    'õ', // 0x00F5 LATIN SMALL LETTER O WITH TILDE
    'ö', // 0x00F6 LATIN SMALL LETTER O WITH DIAERESIS
    '÷', // 0x00F7 DIVISION SIGN
    'ø', // 0x00F8 LATIN SMALL LETTER O WITH STROKE
    'ù', // 0x00F9 LATIN SMALL LETTER U WITH GRAVE
    'ú', // 0x00FA LATIN SMALL LETTER U WITH ACUTE
    'û', // 0x00FB LATIN SMALL LETTER U WITH CIRCUMFLEX
    'ü', // 0x00FC LATIN SMALL LETTER U WITH DIAERESIS
    'ý', // 0x00FD LATIN SMALL LETTER Y WITH ACUTE
    'þ', // 0x00FE LATIN SMALL LETTER THORN
    'ÿ', // 0x00FF LATIN SMALL LETTER Y WITH DIAERESIS
];

const utf16UpperBound = 65535;
const charLimit = 150;

describe('sanitizeConnectiveName', () => {
    it('limits the name to 150 characters', () => {
        const name = sanitizeConnectiveName('a'.repeat(200));
        expect(name.length).toBe(charLimit);
    });

    it('limits the name to 150 characters after removal', () => {
        const name = sanitizeConnectiveName(`<${'a'.repeat(charLimit)}`);
        expect(name.length).toBe(charLimit);
    });

    it('removes all illegal characters', () => {
        let aLotOfCharacters = '';
        for (let i = 0; i < utf16UpperBound; i++) {
            aLotOfCharacters += String.fromCharCode(i);
        }

        for (let index = 0; index <= aLotOfCharacters.length; index += charLimit) {
            const test = aLotOfCharacters.substring(index, index + charLimit);
            const sanitized = sanitizeConnectiveName(test);

            for (const sanitizedChar of sanitized) {
                expect(allowedCharacters).toContain(sanitizedChar);
            }
        }
    });

    it('does not change a valid name', () => {
        const allowedCharacterString = allowedCharacters.join('');

        for (let index = 0; index <= allowedCharacterString.length; index += charLimit) {
            const test = allowedCharacterString.substring(index, index + charLimit);
            const sanitized = sanitizeConnectiveName(test);
            expect(sanitized).toBe(test);
        }
    });
});
