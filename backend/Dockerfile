# Estágio 1: Build
# Usa uma imagem Maven com Java 17 para compilar o projeto
FROM maven:3.9.8-eclipse-temurin-17 AS build
# Define o diretório de trabalho dentro do container
WORKDIR /opt/app
# Copia todo código-fonte para dentro do container
COPY . .
# Executa o build do projeto, gerando o JAR em /opt/app/target/
RUN mvn clean package -DskipTests

# Estágio 2: Runtime
# Usa uma imagem leve do Java 17 para rodar o app
FROM eclipse-temurin:17-alpine-3.20
# Cria o diretório /opt/app
RUN mkdir /opt/app
# Usando ARG para tornar o nome do JAR flexível. O valor padrão pode ser alterado no build.
ARG JAR_FILE=ms-produto-0.0.1-SNAPSHOT.jar
# Copia o JAR usando o argumento, permitindo mudar o nome do arquivo sem editar o Dockerfile.
COPY --from=build /opt/app/target/${JAR_FILE} /opt/app/app.jar
WORKDIR /opt/app
# Expõe a porta 8080 (padrão do Spring Boot)
EXPOSE 8080

# Define o comando para iniciar a aplicação
# Comando para rodar a aplicação em PRODUÇÃO.
# --- Opção 1 (Produção): Roda o JAR diretamente ---
# Esta é a abordagem recomendada por ser a mais leve e eficiente.
# Faz o container um executável.
#CMD ["java", "-jar", "app.jar"]
ENTRYPOINT ["java", "-jar", "app.jar"]

# --- Opção 2 (Desenvolvimento): Roda via Maven ---
# Esta opção é mais pesada, mas permite recursos como hot-reloads.
# CMD ["./mvnw", "spring-boot:run"]
# ENTRYPOINT ["./mvnw", "spring-boot:run"]

