package com.playgrid.apiGateway.util;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

@Component
public class PublicRouteValidator {

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    public boolean isPublic(String path, HttpMethod method) {
        if (HttpMethod.OPTIONS.equals(method)) {
            return true;
        }

        if (HttpMethod.POST.equals(method)) {
            return path.equals("/auth/register") || path.equals("/auth/login");
        }

        if (HttpMethod.GET.equals(method)) {
            return path.equals("/games")
                    || path.equals("/games/search")
                    || pathMatcher.match("/games/category/**", path)
                    || pathMatcher.match("/games/*", path)
                    || pathMatcher.match("/uploads/**", path);
        }

        return false;
    }
}
