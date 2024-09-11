const { select, input, checkbox } = require('@inquirer/prompts')

let metas = [{
    value: "Beber 3L de água por dia",
    checked: false,
}]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta: "})

    if (meta.length == 0){
        console.log("A meta não pode ser vazia.")
        return
    }

    metas.push({
        value: meta,
        checked: false
    })
}

async function listarMetas(){
    const respostas = await checkbox({
        message:"Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa", 
        instructions:false,
        choices: [...metas]
    })
    if (respostas.length == 0){
        console.log("Nenhuma meta selecionada!")
        return
    }
    metas.forEach((m) => {
        m.checked = false
    })
    
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })
        meta.checked = true
    })
    console.log('Meta(s) marcadas como concluída(s)')
}

const metasRealizadas = async() => {
    const realizadas = metas.filter((meta) => {
        return meta.checked == true
    })   
    if (metas.length == 0){
        console.log('Não existem metas realizadas!')
        return
    }

    await select({
        message: "Metas Realizadas",
        choices: [...realizadas]
    })

}

const start = async () => {

    while(true) {
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
            case "realizadas":
                await metasRealizadas()
                break
            case "pendentes":

            case "sair":
                console.log("Até a Próxima")
                return

        }
    }
}
start()