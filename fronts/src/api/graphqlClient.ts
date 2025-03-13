import { ApolloClient, InMemoryCache } from "@apollo/client";

// Definir múltiples clientes GraphQL para distintos servicios
const clients = {
  publicacion: new ApolloClient({
    uri: "http://localhost:8080/publicacion",
    cache: new InMemoryCache(),
  }),
  requisicion: new ApolloClient({
    uri: "http://localhost:8080/requisicion",
    cache: new InMemoryCache(),
  }),
  candidatos: new ApolloClient({
    uri: "http://localhost:8080/candidatos",
    cache: new InMemoryCache(),
  }),
  evaluacion: new ApolloClient({
    uri: "http://localhost:8080/evaluacion",
    cache: new InMemoryCache(),
  }),
  seleccion: new ApolloClient({
    uri: "http://localhost:8080/seleccion",
    cache: new InMemoryCache(),
  }),
};

// Exportar los clientes
export default clients;
