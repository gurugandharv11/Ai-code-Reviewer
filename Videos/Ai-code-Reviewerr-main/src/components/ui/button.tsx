function Button(props:any){
  return (
    <button {...props}>
      {props.children}
    </button>
  )
}

export { Button }