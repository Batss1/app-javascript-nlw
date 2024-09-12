const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao App de metas";
let metas


const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: "})

    if (meta.length == 0){
        mensagem = "A meta não pode ser vazia."
        return
    }

    metas.push({
        value: meta,
        checked: false
    })
    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    if (metas.length == 0){
        mensagem = "Não existem metas"
        return
    }
    const respostas = await checkbox({
        message:"Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa", 
        instructions:false,
        choices: [...metas]
    })

    metas.forEach((m) => {
        m.checked = false
    })
    
    if (respostas.length == 0){
        mensagem = "Nenhuma meta selecionada!"
        return
    }
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })
    mensagem = "Meta(s) marcadas como concluída(s)"
}

const metasRealizadas = async() => {
    if (metas.length == 0){
        mensagem = "Não existem metas"
        return
    }
    const realizadas = metas.filter((meta) => {
        return meta.checked == true
    })   
    if (realizadas.length == 0){
        mensagem = "Não existem metas realizadas!"
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}
const metasPendentes = async () => {
    if (metas.length == 0){
        mensagem = "Não existem metas"
        return
    }
    const pendentes = metas.filter((meta) => {
        return !meta.checked 
    })
    if (pendentes.length == 0){
        mensagem = "Não existem metas pendentes!"
        return
    }
    await select({
        message: "Metas Pendentes: " + pendentes.length,
        choices: [...pendentes]
    })

}

const deletarMetas = async () => {
    if (metas.length == 0){
        mensagem = "Não existem metas"
        return
    }
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })
    const itemsADeletar = await checkbox({ 
        message: "Use as setas para mudar a meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metasDesmarcadas],
        instructions: false
    })
    
    if (itemsADeletar.length == 0){
        mensagem = "Nenhuma item selecionado para ser deletada"
        return
    }
    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item.value
        })
        mensagem = "Meta(s) deletada(s) com sucesso"
    })
}

const mostrarMensagem = () => {
    console.clear();
    if (mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    await carregarMetas()
    
    while(true) {
        mostrarMensagem()
        await salvarMetas()
        
        const opcao = await select({
            message: 'Menu >',
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"

                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas pendentes",
                    value: "pendentes"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })
        
        
        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "deletar": 
                await deletarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "pendentes":
                await metasPendentes()
                break
            case "sair":
                console.log("Até a Próxima")
                return

        }
    }
}

start()