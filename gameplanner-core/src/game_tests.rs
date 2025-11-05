#[cfg(test)]
mod tests {
    use crate::game::{Game, GameItem, Resource};

    #[test]
    fn test_resource_creation() {
        let resource = Resource::new("Minerals", 100.0);
        assert_eq!(resource.name, "Minerals");
        assert_eq!(resource.amount, 100.0);
    }

    #[test]
    fn test_game_item_creation() {
        let item = GameItem::new("e4", "e4", "Pawn Move");
        assert_eq!(item.id, "e4");
        assert_eq!(item.name, "e4");
        assert_eq!(item.category, "Pawn Move");
        assert_eq!(item.time_cost, 0.0);
        assert!(item.resources.is_empty());
    }

    #[test]
    fn test_game_item_builder() {
        let item = GameItem::new("knight_move", "Nf3", "Knight")
            .with_description("Develop knight to f3")
            .with_time_cost(1.0)
            .with_resource(Resource::new("Move", 1.0));

        assert_eq!(item.description, "Develop knight to f3");
        assert_eq!(item.time_cost, 1.0);
        assert_eq!(item.resources.len(), 1);
        assert_eq!(item.resources[0].name, "Move");
    }

    #[test]
    fn test_game_creation() {
        let game = Game::new("test_game", "Test Game");
        assert_eq!(game.id, "test_game");
        assert_eq!(game.name, "Test Game");
        assert!(game.items.is_empty());
    }

    #[test]
    fn test_game_add_item() {
        let mut game = Game::new("chess", "Chess");
        let item = GameItem::new("e4", "e4", "Opening");
        game.add_item(item);
        assert_eq!(game.items.len(), 1);
    }

    #[test]
    fn test_game_find_item() {
        let mut game = Game::new("chess", "Chess");
        game.add_item(GameItem::new("e4", "e4", "Opening"));
        game.add_item(GameItem::new("d4", "d4", "Opening"));

        let found = game.find_item("e4");
        assert!(found.is_some());
        assert_eq!(found.unwrap().id, "e4");

        let not_found = game.find_item("nonexistent");
        assert!(not_found.is_none());
    }

    #[test]
    fn test_game_find_item_reference_equality() {
        let mut game = Game::new("chess", "Chess");
        game.add_item(GameItem::new("e4", "e4", "Opening"));

        let found1 = game.find_item("e4").unwrap();
        let found2 = game.find_item("e4").unwrap();

        // Arc references should point to the same item
        assert!(std::sync::Arc::ptr_eq(&found1, &found2));
    }
}
