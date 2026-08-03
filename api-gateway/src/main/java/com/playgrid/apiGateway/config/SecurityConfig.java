package com.playgrid.apiGateway.config;

import com.playgrid.apiGateway.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableReactiveMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers(HttpMethod.POST, "/auth/register", "/auth/login").permitAll()
                        .pathMatchers(HttpMethod.GET, "/games", "/games/*", "/games/search", "/games/category/**", "/uploads/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/games").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/games/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/games/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/library/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.GET, "/library/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.POST, "/wishlist/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.GET, "/wishlist/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.DELETE, "/wishlist/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.POST, "/reviews/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.PUT, "/reviews/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.DELETE, "/reviews/**").hasAuthority("ROLE_USER")
                        .pathMatchers(HttpMethod.GET, "/reviews/**").hasAuthority("ROLE_USER")
                        .anyExchange().authenticated()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((exchange, ex) -> {
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED);
                            return exchange.getResponse().setComplete();
                        })
                        .accessDeniedHandler((exchange, ex) -> {
                            exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.FORBIDDEN);
                            return exchange.getResponse().setComplete();
                        })
                )
                .addFilterAt(jwtAuthenticationFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}
