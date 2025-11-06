#[cfg(test)]
mod tests {
    use crate::build_order::{BuildOrder, BuildOrderStep};
    use crate::game::{Game, GameItem, Resource};
    use fory::Fory;
    use std::sync::Arc;

    // Type IDs for Fory registration - must be unique across the application
    const RESOURCE_TYPE_ID: u32 = 1;
    const GAME_ITEM_TYPE_ID: u32 = 2;
    const BUILD_ORDER_STEP_TYPE_ID: u32 = 3;
    const BUILD_ORDER_TYPE_ID: u32 = 4;
    const GAME_TYPE_ID: u32 = 5;

    /// Helper function to create a Fory instance with all types registered
    fn setup_fory() -> Result<Fory, Box<dyn std::error::Error>> {
        let mut fory = Fory::default();
        fory.register::<Resource>(RESOURCE_TYPE_ID)?;
        fory.register::<GameItem>(GAME_ITEM_TYPE_ID)?;
        fory.register::<BuildOrderStep>(BUILD_ORDER_STEP_TYPE_ID)?;
        fory.register::<BuildOrder>(BUILD_ORDER_TYPE_ID)?;
        fory.register::<Game>(GAME_TYPE_ID)?;
        Ok(fory)
    }

    #[test]
    fn test_resource_fory_serialization() {
        let fory = setup_fory().expect("Failed to setup Fory");

        let resource = Resource::new("Minerals", 100.0);

        // Serialize
        let bytes = fory
            .serialize(&resource)
            .expect("Failed to serialize Resource");

        // Deserialize
        let deserialized: Resource = fory
            .deserialize(&bytes)
            .expect("Failed to deserialize Resource");

        assert_eq!(resource.name, deserialized.name);
        assert_eq!(resource.amount, deserialized.amount);
    }

    #[test]
    fn test_game_item_fory_serialization() {
        let fory = setup_fory().expect("Failed to setup Fory");

        let item = GameItem::new("e4", "e4", "Opening")
            .with_description("King's pawn opening")
            .with_time_cost(1.0)
            .with_resource(Resource::new("Move", 1.0));

        // Serialize
        let bytes = fory.serialize(&item).expect("Failed to serialize GameItem");

        // Deserialize
        let deserialized: GameItem = fory
            .deserialize(&bytes)
            .expect("Failed to deserialize GameItem");

        assert_eq!(item.id, deserialized.id);
        assert_eq!(item.name, deserialized.name);
        assert_eq!(item.category, deserialized.category);
        assert_eq!(item.description, deserialized.description);
        assert_eq!(item.time_cost, deserialized.time_cost);
        assert_eq!(item.resources.len(), deserialized.resources.len());
        assert_eq!(item.resources[0].name, deserialized.resources[0].name);
        assert_eq!(item.resources[0].amount, deserialized.resources[0].amount);
    }

    #[test]
    fn test_game_fory_serialization() {
        let fory = setup_fory().expect("Failed to setup Fory");

        let mut game = Game::new("chess", "Chess").with_description("Classic chess game");
        game.add_item(GameItem::new("e4", "e4", "Opening"));
        game.add_item(GameItem::new("Nf3", "Nf3", "Knight Move"));

        // Serialize
        let bytes = fory.serialize(&game).expect("Failed to serialize Game");

        // Deserialize
        let deserialized: Game = fory
            .deserialize(&bytes)
            .expect("Failed to deserialize Game");

        assert_eq!(game.id, deserialized.id);
        assert_eq!(game.name, deserialized.name);
        assert_eq!(game.description, deserialized.description);
        assert_eq!(game.items.len(), deserialized.items.len());
    }

    #[test]
    fn test_build_order_fory_serialization() {
        let fory = setup_fory().expect("Failed to setup Fory");

        let item1 = Arc::new(GameItem::new("e4", "e4", "Opening"));
        let item2 = Arc::new(GameItem::new("e5", "e5", "Response"));

        let mut build_order = BuildOrder::new("Italian Game");
        build_order.add_step(item1.clone());
        build_order.add_step_with_notes(item2.clone(), "Black responds");

        // Serialize
        let bytes = fory
            .serialize(&build_order)
            .expect("Failed to serialize BuildOrder");

        // Deserialize
        let deserialized: BuildOrder = fory
            .deserialize(&bytes)
            .expect("Failed to deserialize BuildOrder");

        assert_eq!(build_order.name, deserialized.name);
        assert_eq!(build_order.steps.len(), deserialized.steps.len());
        assert_eq!(
            build_order.steps[0].step_number,
            deserialized.steps[0].step_number
        );
        assert_eq!(build_order.steps[1].notes, deserialized.steps[1].notes);
    }

    #[test]
    fn test_build_order_step_fory_serialization() {
        let fory = setup_fory().expect("Failed to setup Fory");

        let item = Arc::new(GameItem::new("e4", "e4", "Opening").with_time_cost(1.0));
        let step = BuildOrderStep::new(1, item).with_notes("First move");

        // Serialize
        let bytes = fory
            .serialize(&step)
            .expect("Failed to serialize BuildOrderStep");

        // Deserialize
        let deserialized: BuildOrderStep = fory
            .deserialize(&bytes)
            .expect("Failed to deserialize BuildOrderStep");

        assert_eq!(step.step_number, deserialized.step_number);
        assert_eq!(step.notes, deserialized.notes);
        assert_eq!(step.item.id, deserialized.item.id);
    }

    #[test]
    fn test_complex_build_order_with_shared_items() {
        let fory = setup_fory().expect("Failed to setup Fory");

        // Create items that will be shared across multiple steps
        let opening = Arc::new(GameItem::new("e4", "e4", "Opening").with_time_cost(1.0));
        let response = Arc::new(GameItem::new("e5", "e5", "Response").with_time_cost(1.0));

        let mut build_order = BuildOrder::new("Test Opening");
        build_order.add_step(opening.clone());
        build_order.add_step(response.clone());
        build_order.add_step(opening.clone()); // Reuse the same item

        // Serialize
        let bytes = fory
            .serialize(&build_order)
            .expect("Failed to serialize BuildOrder");

        // Deserialize
        let deserialized: BuildOrder = fory
            .deserialize(&bytes)
            .expect("Failed to deserialize BuildOrder");

        assert_eq!(build_order.steps.len(), deserialized.steps.len());
        assert_eq!(deserialized.steps[0].item.id, "e4");
        assert_eq!(deserialized.steps[1].item.id, "e5");
        assert_eq!(deserialized.steps[2].item.id, "e4");

        // Verify time calculation works after deserialization
        let total_time = deserialized.total_time();
        assert_eq!(total_time, 3.0);
    }
}
