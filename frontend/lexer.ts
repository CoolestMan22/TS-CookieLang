export enum TokenType {
  // * Literal tokens *//
  Number, // 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
  Identifier, // Variable name
  String, // ", '
  SemiColon, // ;
  Pipe, // |

  //* Keyword tokens *//
  Let, // let
  const, // const
  Func, // func
  Async, // async

  //* Operator tokens *//
  Equals, // =
  OpenParen, // (
  CloseParen, // )
  Comma, // ,
  Dot, // .
  Colon, // :
  OpenBrace, // {
  CloseBrace, // }
  OpenBracket, // [
  CloseBracket, // ]
  BinaryOperator, // +, -, *, /
  Backtick, // `
  EOF, // End of file
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.const,
  func: TokenType.Func,
  async: TokenType.Async,
};

export interface Token {
  value: string;
  type: TokenType;
}

function Token(value = "", type: TokenType): Token {
  return { value, type };
}

function isAlpha(c: string): boolean {
  return c.toUpperCase() != c.toLowerCase();
}

function isDigit(c: string): boolean {
  const code = c.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return code >= bounds[0] && code <= bounds[1];
}

function canSkip(c: string): boolean {
  return c == " " || c == "\n" || c == "\t" || c == "\r" || c == "\u0014";
}

export function Tokenize(srcCode: string): Token[] {
  const Tokens = new Array<Token>();
  const src = srcCode.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      Tokens.push(Token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      Tokens.push(Token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == "{") {
      Tokens.push(Token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == "}") {
      Tokens.push(Token(src.shift(), TokenType.CloseBrace));
    } else if (src[0] == "[") {
      Tokens.push(Token(src.shift(), TokenType.OpenBracket));
    } else if (src[0] == "]") {
      Tokens.push(Token(src.shift(), TokenType.CloseBracket));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      Tokens.push(Token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
      Tokens.push(Token(src.shift(), TokenType.Equals));
    } else if (src[0] == "|") {
      Tokens.push(Token(src.shift(), TokenType.Pipe));
    } else if (src[0] == ":") {
      Tokens.push(Token(src.shift(), TokenType.Colon));
    } else if (src[0] == ";") {
      Tokens.push(Token(src.shift(), TokenType.SemiColon));
    } else if (src[0] == ",") {
      Tokens.push(Token(src.shift(), TokenType.Comma));
    } else if (src[0] == `"` || src[0] == "'"){
      Tokens.push(Token(src.shift(), TokenType.String));
    } else if (src[0] == "`") {
      Tokens.push(Token(src.shift(), TokenType.Backtick));
    } else if (src[0] == '.') {
      Tokens.push(Token(src.shift(), TokenType.Dot));
    } else {
      // Handle multi-char tokens
      if (isDigit(src[0])) {
        let n = "";
        while (src.length > 0 && isDigit(src[0])) {
          n += src.shift();
        }

        Tokens.push(Token(n, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let id = "";
        while (src.length > 0 && isAlpha(src[0])) {
          id += src.shift();
        }

        // CHECK FOR RESERVED KEYWORDS
        const reserved = KEYWORDS[id];
        // If value is not undefined then the identifier is
        // reconized keyword
        if (typeof reserved == "number") {
          Tokens.push(Token(id, reserved));
        } else {
          // Unreconized name must mean user defined symbol.
          Tokens.push(Token(id, TokenType.Identifier));
        }
      } else if (canSkip(src[0])) {
        src.shift();
      } else {
        console.log(`Unexpected token: ${src[0]}`);
        Deno.exit(1);
      }
    }
  }

  Tokens.push(Token("EndOfFile", TokenType.EOF));
  return Tokens;
}
