// import { AuthProvider } from "./AuthContext";
import { useAppStore } from "../lib/store";
import { LegacyUploadProvider } from "./LegacyUploadContext";
import { MobileUploadProvider } from "./MobileUploadContext";
// import { ThemeProvider } from "./ThemeContext";

export const AppProviders = ({ children }) => {
    const { user } = useAppStore();
  return (
    // <AuthProvider>
      <MobileUploadProvider key={user}>
        <LegacyUploadProvider key={user}>
        
        {/* <ThemeProvider> */}
          {children}
        {/* </ThemeProvider> */}
        </LegacyUploadProvider>
      </MobileUploadProvider>
    // </AuthProvider>
  );
};
