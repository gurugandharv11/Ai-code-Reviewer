function Tabs(props:any){
  return <div {...props}>{props.children}</div>
}

function TabsList(props:any){
  return <div {...props}>{props.children}</div>
}

function TabsTrigger(props:any){
  return <button {...props}>{props.children}</button>
}

function TabsContent(props:any){
  return <div {...props}>{props.children}</div>
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
}