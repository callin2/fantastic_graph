

$$: (arg) ->
    argType = typeof arg

switch argType
    when 'string'
        if arg[0] == '<'
            tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = arg
        if tmpDiv.childElementCount == 1
            tmpDiv.children[0]
        else
            throw new Error("only one root tag allowed!")
    else
        document.querySelectorAll(arg)
        when 'function'
        document.addEventListener('ready', arg)