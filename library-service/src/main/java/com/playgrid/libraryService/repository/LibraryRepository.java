package com.playgrid.libraryService.repository;


import com.playgrid.libraryService.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LibraryRepository extends JpaRepository<Library, Long> {

    List<Library> findByUserId(Long userId);

    Optional<Library> findByUserIdAndGameId(Long userId, Long gameId);

}
