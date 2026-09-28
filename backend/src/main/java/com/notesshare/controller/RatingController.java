package com.notesshare.controller;

import com.notesshare.dto.common.ApiResponse;
import com.notesshare.dto.rating.RatingRequest;
import com.notesshare.dto.rating.RatingResponse;
import com.notesshare.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes/{noteId}/ratings")
@Tag(name = "Ratings", description = "Endpoints for rating academic notes")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    @Operation(summary = "Rate a note", description = "Submits a rating between 1 and 5 stars. Prevents duplicate ratings.")
    public ResponseEntity<ApiResponse<RatingResponse>> rateNote(
            @PathVariable Long noteId,
            @Valid @RequestBody RatingRequest request) {
        RatingResponse response = ratingService.addRating(noteId, request);
        return new ResponseEntity<>(ApiResponse.success("Rating submitted successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get ratings for a note", description = "Returns all ratings submitted for a note")
    public ResponseEntity<ApiResponse<List<RatingResponse>>> getRatings(@PathVariable Long noteId) {
        List<RatingResponse> responses = ratingService.getRatingsByNoteId(noteId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
