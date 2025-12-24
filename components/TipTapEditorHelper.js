export function convertCustomPluginsToButtons(customPlugins = []) {
  if (!Array.isArray(customPlugins) || customPlugins.length === 0) {
    return [];
  }

  return customPlugins
    .map((plugin) => {
      if (typeof plugin === "function") {
        try {
          const pluginObj = plugin();
          if (pluginObj && pluginObj.setSubmenu) {
            return {
              name: pluginObj.name,
              title: pluginObj.title,
              innerHTML: pluginObj.innerHTML,
              button: pluginObj.innerHTML,
              items: [],
            };
          }
        } catch (e) {
          console.warn("Error converting plugin:", e);
        }
      } else if (plugin && typeof plugin === "object") {
        return {
          name: plugin.name,
          title: plugin.title,
          innerHTML: plugin.innerHTML,
          button: plugin.innerHTML,
          items: plugin.items || [],
        };
      }
      return null;
    })
    .filter(Boolean);
}

export function createButtonWithItems(pluginData, songokhTalbaruud = []) {
  return {
    name: pluginData.name,
    title: pluginData.title,
    innerHTML: pluginData.innerHTML || pluginData.button,
    button: pluginData.innerHTML || pluginData.button,
    items: songokhTalbaruud.map((item) => ({
      ner: item.ner,
      talbar: item.talbar,
      label: item.ner,
      value: `<${item.talbar}>`,
    })),
  };
}
