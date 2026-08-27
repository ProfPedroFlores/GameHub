# Utiliza a imagem oficial do Node.js como base.
# A versão 24 mantém o ambiente alinhado com a versão
FROM node:24-alpine

# Define o diretório de trabalho da aplicação dentro do container
WORKDIR /app/backend

# Copia primeiro apenas os arquivos das dependências
COPY backend/package*.json ./

# Instala as versões registradas
RUN npm ci --omit=dev
# --omit=dev evita dependências exclusivamente de desenvolvimento
# na imagem final

# Copia o frontend
# O Express procura a pasta ../public
# Dentro do container:
# /app/public /app/backend
COPY public/ /app/public/

# Copia os arquivos do backend para o container
COPY backend/ ./

# Qual porta?
EXPOSE 3000

# Comando executado quando o container iniciar

CMD ["node", "server.js"]