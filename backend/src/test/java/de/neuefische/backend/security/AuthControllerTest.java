package de.neuefische.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void authControllerGetMeNotLoggedIn() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authControllerGetMeWithLoggedIn() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                //Simple alternative with oauth2Login
//                        .with(oauth2Login()
//                                .attributes(a -> {
//                                    a.put("sub", "user-id");
//                                    a.put("login", "testUser");
//                                    a.put("avatar_url", "image-url");
//                                }))
                        .with(oidcLogin()
                                .idToken(i -> i.subject("user-id"))
                                .userInfoToken(token -> token
                                        .claim("login", "testUser")
                                        .claim("avatar_url", "image-url")
                                ))
                )
                .andExpect(status().isOk())
                .andExpect(content().string("user-id"));
    }
}
