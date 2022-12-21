# Emo

Este foi um projeto para a disciplina de Oficina de Integração do curso de Eng. de Computação da UTFPR. A ideia deste projeto é detectar as emoções do usuário a partir dos modelos de predição da biblioteca face-api.js e gerar relatórios das detecções realizadas.

O backend do projeto está disponível em: [Emo API](https://github.com/igomonteiro/emo_api)

### Ajustes e melhorias para trabalhos futuros

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ ] Limpar os modelos que não são utilizados na aplicação
- [ ] Otimizar e refatorar o código, este projeto foi feito quando eu ainda era um juninho
- [ ] Ao invés de utilizar uma biblioteca terceira, seria legal utilizar um algoritmo e modelo própio
- [ ] Atualizar para Vuejs 3 e utilizar Composition API

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

* Você tem a versão 16 do Node instalada (foi a versão que utilizei quando criei o projeto)

## 🚀 Executando o projeto

Para executar o projeto, siga estas etapas:

- Basta clonar o repositório.
- Executar os comandos npm install ou yarn install para instalar as dependências
- Executar o projeto com npm run serve / yarn serve

## 📝 Observações

Nota-se que no arquivo de configurações do vue (vue.config.js) foram utilizadas opções para utilizar o protocolo SSL e executar o projeto em página HTTPS.
Para executar sem precisar emitir certificados, basta retirar essas opções.

