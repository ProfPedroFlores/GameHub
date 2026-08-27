pipeline {

    // Define onde a pipeline poderá ser executada.
    // Como nosso Jenkins está rodando localmente via .war,
    // ele utilizará a própria máquina Windows como agente.
    agent any
    
    options {
        skipDefaultCheckout(true)
    }


    stages {

        // ======================================================
        // 1. CHECKOUT DO CÓDIGO
        // ======================================================
        stage('Checkout') {

            steps {

                // Baixa para o workspace do Jenkins
                // o repositório configurado no Job.
                checkout scm
            }
        }

    }
}