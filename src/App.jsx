import { AuthProvider } from "./context/AuthContext";
import { NetworkProvider } from "./context/NetworkContext";
import AppRouter from "./router";
function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <AppRouter />
      </NetworkProvider>
    </AuthProvider>
  );
}

export default App;
