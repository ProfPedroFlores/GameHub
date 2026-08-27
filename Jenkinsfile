pipeline {

    // ==========================================================
    // AGENTE
    // ==========================================================
    // Define onde os comandos da pipeline serão executados.
    //
    // Como nosso Jenkins está rodando localmente através
    // do arquivo .war, os comandos serão executados
    // na própria máquina Windows.
    agent any


    // ==========================================================
    // OPÇÕES
    // ==========================================================
    options {

        // Jenkins pode fazer checkout automaticamente
        // quando usamos "Pipeline script from SCM".
        //
        // Como queremos mostrar essa etapa explicitamente,
        // desabilitamos o checkout automático.
        skipDefaultCheckout(true)
    }


    // ==========================================================
    // STAGES DA PIPELINE
    // ==========================================================
    stages {


        // ======================================================
        // 1. CHECKOUT
        // ======================================================
        stage('Checkout') {

            steps {

                // Busca o código-fonte no repositório Git
                // configurado no Job do Jenkins.
                //
                // SCM = Source Code Management.
                checkout scm
            }
        }


        // ======================================================
        // 2. PREPARAÇÃO DO AMBIENTE
        // ======================================================
        stage('Prepare Environment') {

            steps {

                // Recupera o arquivo .env.docker que foi
                // armazenado de forma segura no
                // Jenkins Credentials.
                //
                // O ID precisa ser exatamente o mesmo
                // cadastrado anteriormente no Jenkins.
                withCredentials([
                    file(
                        credentialsId: 'gamehub-env-docker',
                        variable: 'GAMEHUB_ENV_FILE'
                    )
                ]) {

                    // O Jenkins disponibiliza o Secret File
                    // através de um caminho temporário.
                    //
                    // Copiamos esse arquivo para o caminho
                    // esperado pelo compose.yaml:
                    //
                    // backend/.env.docker
                    //
                    // /Y
                    // sobrescreve o arquivo sem perguntar.
                    //
                    // >nul
                    // evita saída desnecessária no console.
                    bat '''
                        @echo off
                        copy /Y "%GAMEHUB_ENV_FILE%" "backend\\.env.docker" >nul
                    '''
                }


                // Verificação simples:
                // confirma que o arquivo existe,
                // mas NÃO mostra seu conteúdo no console.
                bat '''
                    @echo off

                    if exist "backend\\.env.docker" (
                        echo Arquivo de ambiente encontrado.
                    ) else (
                        echo ERRO: arquivo de ambiente nao encontrado.
                        exit /b 1
                    )
                '''
            }
        }


        // ======================================================
        // 3. VALIDAÇÃO
        // ======================================================
        stage('Validate') {

            steps {

                // --------------------------------------------------
                // Verifica se Docker está disponível
                // --------------------------------------------------
                //
                // O Jenkins não "possui Docker".
                //
                // Ele simplesmente executa o Docker instalado
                // na máquina onde seu agente está rodando.
                bat 'docker --version'


                // --------------------------------------------------
                // Verifica Docker Compose
                // --------------------------------------------------
                bat 'docker compose version'


                // --------------------------------------------------
                // Valida o compose.yaml
                // --------------------------------------------------
                //
                // docker compose config interpreta o arquivo
                // e verifica sua estrutura/configuração.
                //
                // Se existir algum erro no YAML, variável,
                // volume ou serviço, a pipeline para aqui.
                //
                // >nul evita imprimir toda a configuração
                // resolvida no console.
                bat 'docker compose config >nul'


                // --------------------------------------------------
                // Validação básica do JavaScript
                // --------------------------------------------------
                //
                // Não substitui uma suíte de testes,
                // mas verifica erros básicos de sintaxe.
                bat '''
                    node --check backend\\server.js
                    node --check backend\\db.js
                    node --check public\\js\\script.js
                '''
            }
        }


        // ======================================================
        // 4. BUILD
        // ======================================================
        stage('Build') {

            steps {

                // Constrói as imagens que possuem
                // configuração "build" no compose.yaml.
                //
                // No nosso caso:
                //
                // GameHub
                //   ↓
                // Dockerfile
                //   ↓
                // imagem da aplicação
                //
                // O MySQL utiliza uma imagem oficial,
                // portanto não é construído por nós.
                bat 'docker compose build'
            }
        }


        // ======================================================
        // 5. DEPLOY
        // ======================================================
        stage('Deploy') {

            steps {

                // Inicia os serviços definidos no Compose.
                //
                // -d = detached mode
                //
                // Os containers continuam rodando em
                // background e o Jenkins pode prosseguir.
                bat 'docker compose up -d'


                // Exibe o estado atual dos serviços
                // no console da pipeline.
                bat 'docker compose ps'
            }
        }


        // ======================================================
        // 6. HEALTH CHECK / SMOKE TEST
        // ======================================================
        stage('Health Check') {

            steps {

                // Não basta saber que:
                //
                // docker compose up
                //
                // terminou sem erro.
                //
                // Precisamos verificar se a aplicação
                // realmente ficou disponível.
                //
                // Para isso usamos o endpoint:
                //
                // GET /api/health
                powershell '''

                    $maxTentativas = 10

                    for (
                        $tentativa = 1;
                        $tentativa -le $maxTentativas;
                        $tentativa++
                    ) {

                        try {

                            Write-Host ""
                            Write-Host "Health Check - tentativa $tentativa de $maxTentativas"

                            $resposta = Invoke-WebRequest `
                                -Uri "http://localhost:3000/api/health" `
                                -TimeoutSec 5 `
                                -UseBasicParsing


                            if ($resposta.StatusCode -eq 200) {

                                Write-Host ""
                                Write-Host "GameHub esta saudavel!"
                                Write-Host "HTTP Status: $($resposta.StatusCode)"

                                exit 0
                            }

                        }
                        catch {

                            Write-Host "GameHub ainda nao esta disponivel."
                        }


                        // Aguarda alguns segundos antes
                        // de realizar uma nova tentativa.
                        Start-Sleep -Seconds 3
                    }


                    // Se chegamos até aqui,
                    // nenhuma tentativa retornou HTTP 200.
                    Write-Error "Health Check do GameHub falhou."

                    exit 1
                '''
            }
        }
    }


    // ==========================================================
    // AÇÕES APÓS A EXECUÇÃO DA PIPELINE
    // ==========================================================
    post {


        // ======================================================
        // SEMPRE
        // ======================================================
        // Executado independentemente do resultado:
        //
        // SUCCESS
        // FAILURE
        // ABORTED
        //
        always {

            // Remove do Workspace a cópia do arquivo secreto.
            //
            // Depois que os containers foram criados,
            // as variáveis já foram injetadas no ambiente
            // dos containers.
            //
            // Não precisamos manter .env.docker exposto
            // no Workspace do Jenkins.
            bat '''
                @echo off

                if exist "backend\\.env.docker" (
                    del /Q "backend\\.env.docker"
                )
            '''
        }


        // ======================================================
        // SUCESSO
        // ======================================================
        success {

            echo '=========================================='
            echo 'GAMEHUB DEPLOYADO COM SUCESSO!'
            echo 'Aplicacao: http://localhost:3000'
            echo 'Health Check: OK'
            echo '=========================================='
        }


        // ======================================================
        // FALHA
        // ======================================================
        failure {

            echo '=========================================='
            echo 'A PIPELINE DO GAMEHUB FALHOU!'
            echo 'Consultando estado dos containers...'
            echo '=========================================='


            // Essas consultas ajudam a identificar
            // rapidamente o problema no console do Jenkins.
            bat '''
                @echo off
                docker compose ps
                docker compose logs --tail=50
            '''
        }
    }
}