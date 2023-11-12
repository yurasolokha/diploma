export class CustomNumberConverter {
  public static Round(num: number, decimals: number){
    if(!num) return num;
    const precision = Math.pow(10, decimals);
    return Math.round(num * precision) / precision;
  }
}