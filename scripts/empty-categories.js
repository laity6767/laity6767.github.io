// Keep all three category links usable before the first post in a category.
hexo.extend.generator.register('empty-category-indexes',function(locals){
  const used=new Set(locals.categories.map(c=>c.name));
  return Object.entries(this.config.category_map).filter(([name])=>!used.has(name)).map(([name,slug])=>({
    path:'categories/'+slug+'/index.html',layout:'empty',data:{title:name}
  }));
});
