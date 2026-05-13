function Card(props:any){
  return <div {...props}>{props.children}</div>
}

function CardHeader(props:any){
  return <div {...props}>{props.children}</div>
}

function CardFooter(props:any){
  return <div {...props}>{props.children}</div>
}

function CardTitle(props:any){
  return <div {...props}>{props.children}</div>
}

function CardDescription(props:any){
  return <div {...props}>{props.children}</div>
}

function CardAction(props:any){
  return <div {...props}>{props.children}</div>
}

function CardContent(props:any){
  return <div {...props}>{props.children}</div>
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}