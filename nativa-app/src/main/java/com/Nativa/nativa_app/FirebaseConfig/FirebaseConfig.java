package com.Nativa.nativa_app.FirebaseConfig;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initializeFirebase() {
        try {
            // Carrega o arquivo JSON de forma segura a partir da pasta src/main/resources
            ClassPathResource resource = new ClassPathResource("nativa-app-c4f73-firebase-adminsdk-fbsvc-e6a96254b3.json");
            InputStream serviceAccount = resource.getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    // Se você for usar o Storage no Java para receber uploads, descomente a linha abaixo:
                    // .setStorageBucket("nome-do-seu-projeto.firebasestorage.app")
                    .build();

            // Previne erros de dupla inicialização se a aplicação recarregar (ex: Spring DevTools)
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase Admin SDK inicializado com sucesso para o Nativa App!");
            }
        } catch (IOException e) {
            System.err.println("Erro ao inicializar o Firebase Admin SDK: " + e.getMessage());
        }
    }
}
