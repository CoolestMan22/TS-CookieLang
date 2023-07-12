import { BinaryExpr, Identifier } from "../../frontend/ast.ts";
import Env from "../env.ts";
import { C_eval } from "../interp.ts";
import { MK_NULL, NumberValue, RunTimeValue } from "../values.ts";

function C_evalNumBinExpr(
  leftside: NumberValue,
  rightside: NumberValue,
  operator: string
): NumberValue {
  let result: number;

  switch (operator) {
    case "+":
      result = leftside.value + rightside.value;
      break;

    case "-":
      result = leftside.value - rightside.value;
      break;
    case "*":
      result = leftside.value * rightside.value;
      break;

    case "/":
      // TODO: Handle divide by zero
      result = leftside.value / rightside.value;
      break;

    default:
      result = leftside.value % rightside.value;
      break;
  }

  return { value: result, type: "number" };
}

export function C_evalBinaryExpr(BinOp: BinaryExpr, env: Env): RunTimeValue {
  const leftside = C_eval(BinOp.left, env);
  const rightside = C_eval(BinOp.right, env);

  if (leftside.type == "number" && rightside.type == "number") {
    return C_evalNumBinExpr(
      leftside as NumberValue,
      rightside as NumberValue,
      BinOp.operator
    );
  }

  // Left or Right (or both) are null
  return MK_NULL();
}

export function C_evalIdentifier(id: Identifier, env: Env): RunTimeValue {
  const val = env.getVar(id.name);
  return val;
}