use crate::game::{Game, GameItem, Resource};

/// Chess game implementation with all possible moves
pub struct ChessGame;

impl ChessGame {
    pub fn create() -> Game {
        let mut game = Game::new("chess", "Chess")
            .with_description("Classic chess game - plan your move sequences and opening strategies");

        // Pawn moves
        Self::add_pawn_moves(&mut game);

        // Knight moves
        Self::add_knight_moves(&mut game);

        // Bishop moves
        Self::add_bishop_moves(&mut game);

        // Rook moves
        Self::add_rook_moves(&mut game);

        // Queen moves
        Self::add_queen_moves(&mut game);

        // King moves
        Self::add_king_moves(&mut game);

        // Special moves
        Self::add_special_moves(&mut game);

        game
    }

    fn add_pawn_moves(game: &mut Game) {
        // Pawn moves are represented by their algebraic notation
        game.add_item(
            GameItem::new("e4", "e4", "Pawn Opening")
                .with_description("King's pawn opening - advance pawn to e4")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("d4", "d4", "Pawn Opening")
                .with_description("Queen's pawn opening - advance pawn to d4")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("c4", "c4", "Pawn Opening")
                .with_description("English Opening - advance pawn to c4")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("e5", "e5", "Pawn Response")
                .with_description("Symmetrical response - advance pawn to e5")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("d5", "d5", "Pawn Response")
                .with_description("Advance pawn to d5")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("c5", "c5", "Pawn Response")
                .with_description("Sicilian Defense - advance pawn to c5")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );
    }

    fn add_knight_moves(game: &mut Game) {
        game.add_item(
            GameItem::new("nf3", "Nf3", "Knight Development")
                .with_description("Develop knight to f3")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("nc3", "Nc3", "Knight Development")
                .with_description("Develop knight to c3")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("nf6", "Nf6", "Knight Development")
                .with_description("Develop knight to f6")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("nc6", "Nc6", "Knight Development")
                .with_description("Develop knight to c6")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );
    }

    fn add_bishop_moves(game: &mut Game) {
        game.add_item(
            GameItem::new("bc4", "Bc4", "Bishop Development")
                .with_description("Italian Game - develop bishop to c4")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("bb5", "Bb5", "Bishop Development")
                .with_description("Ruy Lopez - develop bishop to b5")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("bc5", "Bc5", "Bishop Development")
                .with_description("Develop bishop to c5")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("be7", "Be7", "Bishop Development")
                .with_description("Develop bishop to e7")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );
    }

    fn add_rook_moves(game: &mut Game) {
        game.add_item(
            GameItem::new("re1", "Re1", "Rook Activation")
                .with_description("Move rook to e1")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("rd1", "Rd1", "Rook Activation")
                .with_description("Move rook to d1")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );
    }

    fn add_queen_moves(game: &mut Game) {
        game.add_item(
            GameItem::new("qe2", "Qe2", "Queen Development")
                .with_description("Move queen to e2")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("qd2", "Qd2", "Queen Development")
                .with_description("Move queen to d2")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );
    }

    fn add_king_moves(game: &mut Game) {
        game.add_item(
            GameItem::new("ke2", "Ke2", "King Move")
                .with_description("Move king to e2 (unusual)")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );
    }

    fn add_special_moves(game: &mut Game) {
        game.add_item(
            GameItem::new("o-o", "O-O", "Castling")
                .with_description("Castle kingside")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );

        game.add_item(
            GameItem::new("o-o-o", "O-O-O", "Castling")
                .with_description("Castle queenside")
                .with_time_cost(1.0)
                .with_resource(Resource::new("Move Number", 1.0)),
        );
    }

    /// Creates a sample Italian Game opening sequence
    pub fn italian_game_sample() -> Vec<String> {
        vec![
            "e4".to_string(),
            "e5".to_string(),
            "nf3".to_string(),
            "nc6".to_string(),
            "bc4".to_string(),
            "bc5".to_string(),
        ]
    }

    /// Creates a sample Ruy Lopez opening sequence
    pub fn ruy_lopez_sample() -> Vec<String> {
        vec![
            "e4".to_string(),
            "e5".to_string(),
            "nf3".to_string(),
            "nc6".to_string(),
            "bb5".to_string(),
        ]
    }

    /// Creates a sample Sicilian Defense sequence
    pub fn sicilian_defense_sample() -> Vec<String> {
        vec![
            "e4".to_string(),
            "c5".to_string(),
            "nf3".to_string(),
            "d6".to_string(),
            "d4".to_string(),
        ]
    }
}
