// Press ctrl+space for code completion
function isImport(node, imported) {
  return node.type === "ImportDeclaration" && node.source.value === imported;
}

function isImportSafeReaper(node) {
  return isImport(node, "safe-reaper");
}
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const ast = j(file.source);
  ast.find(j.ImportDeclaration, isImportSafeReaper).forEach((path) => {
    j(path).replaceWith("");
  });
  ast.find(j.Identifier, { name: "reap" }).forEach((path) => {
    j(path.parentPath).replaceWith((p) => {
      const params = path.parentPath.node.arguments;
      let result = "";
      const [source, keys] = params;
      const parsedKeys = keys.value.split(".").join("?.");
      result = `${source.name}?.${parsedKeys}`;
      if (params.length === 3) {
        const defaultValue = params[2].value;
        let parsedValue = typeof defaultValue === "string" ? `'${defaultValue}'` : defaultValue;
        result += ` || ${parsedValue}`;
      }
      return result;
      return j.identifier(
        path.parentPath.node.arguments.map((item) => item.name || item.value).join("")
      );
    });
  });
  return ast.toSource();
}
