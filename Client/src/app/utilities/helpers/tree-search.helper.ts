export class TreeSearchHelper {
    public static search<T>(
        startNode: T,
        result: T[],
        childSelector: (node: T) => T[],
        filter?: (node: T) => boolean
        ): void {
        const childs = childSelector(startNode)

        const res = !filter ? childs : childs.filter(filter); 

        if (!!res) {
          result.push(...res);
    
          res.forEach((e) => {
            this.search(e, result, childSelector, filter);
          });
        }
      }
}