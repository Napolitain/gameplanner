use crate::chess::ChessGame;

#[test]
fn test_chess_game_creation() {
    let game = ChessGame::create();
    assert_eq!(game.id, "chess");
    assert_eq!(game.name, "Chess");
    assert!(!game.items.is_empty());
}

#[test]
fn test_chess_game_has_pawn_moves() {
    let game = ChessGame::create();

    assert!(game.find_item("e4").is_some());
    assert!(game.find_item("d4").is_some());
    assert!(game.find_item("c4").is_some());
    assert!(game.find_item("e5").is_some());
    assert!(game.find_item("d5").is_some());
    assert!(game.find_item("c5").is_some());
}

#[test]
fn test_chess_game_has_knight_moves() {
    let game = ChessGame::create();

    assert!(game.find_item("nf3").is_some());
    assert!(game.find_item("nc3").is_some());
    assert!(game.find_item("nf6").is_some());
    assert!(game.find_item("nc6").is_some());
}

#[test]
fn test_chess_game_has_bishop_moves() {
    let game = ChessGame::create();

    assert!(game.find_item("bc4").is_some());
    assert!(game.find_item("bb5").is_some());
    assert!(game.find_item("bc5").is_some());
    assert!(game.find_item("be7").is_some());
}

#[test]
fn test_chess_game_has_special_moves() {
    let game = ChessGame::create();

    assert!(game.find_item("o-o").is_some());
    assert!(game.find_item("o-o-o").is_some());
}

#[test]
fn test_italian_game_sample() {
    let moves = ChessGame::italian_game_sample();
    assert_eq!(moves.len(), 6);
    assert_eq!(moves[0], "e4");
    assert_eq!(moves[1], "e5");
    assert_eq!(moves[2], "nf3");
    assert_eq!(moves[3], "nc6");
    assert_eq!(moves[4], "bc4");
    assert_eq!(moves[5], "bc5");
}

#[test]
fn test_ruy_lopez_sample() {
    let moves = ChessGame::ruy_lopez_sample();
    assert_eq!(moves.len(), 5);
    assert_eq!(moves[0], "e4");
    assert_eq!(moves[1], "e5");
    assert_eq!(moves[2], "nf3");
    assert_eq!(moves[3], "nc6");
    assert_eq!(moves[4], "bb5");
}

#[test]
fn test_sicilian_defense_sample() {
    let moves = ChessGame::sicilian_defense_sample();
    assert_eq!(moves.len(), 5);
    assert_eq!(moves[0], "e4");
    assert_eq!(moves[1], "c5");
}

#[test]
fn test_chess_move_has_time_cost() {
    let game = ChessGame::create();
    let e4 = game.find_item("e4").unwrap();

    assert_eq!(e4.time_cost, 1.0);
}

#[test]
fn test_chess_move_has_category() {
    let game = ChessGame::create();
    let e4 = game.find_item("e4").unwrap();

    assert_eq!(e4.category, "Pawn Opening");
}

#[test]
fn test_chess_move_has_description() {
    let game = ChessGame::create();
    let e4 = game.find_item("e4").unwrap();

    assert!(!e4.description.is_empty());
    assert!(e4.description.contains("pawn"));
}

#[test]
fn test_all_chess_moves_have_move_resource() {
    let game = ChessGame::create();

    for item in &game.items {
        assert!(
            !item.resources.is_empty(),
            "Move {} has no resources",
            item.id
        );
        assert_eq!(item.resources[0].name, "Move Number");
        assert_eq!(item.resources[0].amount, 1.0);
    }
}

#[test]
fn test_chess_game_has_21_moves() {
    let game = ChessGame::create();
    assert_eq!(game.items.len(), 21);
}
