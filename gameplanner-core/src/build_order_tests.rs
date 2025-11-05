#[cfg(test)]
mod tests {
    use crate::build_order::{BuildOrder, BuildOrderStep};
    use crate::game::GameItem;
    use std::sync::Arc;

    fn create_test_item(id: &str, name: &str) -> Arc<GameItem> {
        Arc::new(GameItem::new(id, name, "Test").with_time_cost(1.0))
    }

    #[test]
    fn test_build_order_creation() {
        let order = BuildOrder::new("Test Order");
        assert_eq!(order.name, "Test Order");
        assert!(order.steps.is_empty());
    }

    #[test]
    fn test_add_step() {
        let mut order = BuildOrder::new("Test Order");
        let item = create_test_item("e4", "e4");

        order.add_step(item.clone());
        assert_eq!(order.steps.len(), 1);
        assert_eq!(order.steps[0].step_number, 1);
        assert_eq!(order.steps[0].item.id, "e4");
    }

    #[test]
    fn test_add_multiple_steps() {
        let mut order = BuildOrder::new("Test Order");
        order.add_step(create_test_item("e4", "e4"));
        order.add_step(create_test_item("e5", "e5"));
        order.add_step(create_test_item("nf3", "Nf3"));

        assert_eq!(order.steps.len(), 3);
        assert_eq!(order.steps[0].step_number, 1);
        assert_eq!(order.steps[1].step_number, 2);
        assert_eq!(order.steps[2].step_number, 3);
    }

    #[test]
    fn test_add_step_with_notes() {
        let mut order = BuildOrder::new("Test Order");
        let item = create_test_item("e4", "e4");

        order.add_step_with_notes(item, "King's pawn opening");
        assert_eq!(order.steps.len(), 1);
        assert_eq!(order.steps[0].notes, "King's pawn opening");
    }

    #[test]
    fn test_remove_step() {
        let mut order = BuildOrder::new("Test Order");
        order.add_step(create_test_item("e4", "e4"));
        order.add_step(create_test_item("e5", "e5"));
        order.add_step(create_test_item("nf3", "Nf3"));

        order.remove_step(1); // Remove middle step
        assert_eq!(order.steps.len(), 2);
        assert_eq!(order.steps[0].step_number, 1);
        assert_eq!(order.steps[1].step_number, 2);
        assert_eq!(order.steps[0].item.id, "e4");
        assert_eq!(order.steps[1].item.id, "nf3");
    }

    #[test]
    fn test_remove_step_out_of_bounds() {
        let mut order = BuildOrder::new("Test Order");
        order.add_step(create_test_item("e4", "e4"));

        order.remove_step(10); // Should not panic
        assert_eq!(order.steps.len(), 1);
    }

    #[test]
    fn test_move_step() {
        let mut order = BuildOrder::new("Test Order");
        order.add_step(create_test_item("e4", "e4"));
        order.add_step(create_test_item("e5", "e5"));
        order.add_step(create_test_item("nf3", "Nf3"));

        order.move_step(0, 2); // Move first to last
        assert_eq!(order.steps.len(), 3);
        assert_eq!(order.steps[0].item.id, "e5");
        assert_eq!(order.steps[1].item.id, "nf3");
        assert_eq!(order.steps[2].item.id, "e4");

        // Check renumbering
        assert_eq!(order.steps[0].step_number, 1);
        assert_eq!(order.steps[1].step_number, 2);
        assert_eq!(order.steps[2].step_number, 3);
    }

    #[test]
    fn test_move_step_same_position() {
        let mut order = BuildOrder::new("Test Order");
        order.add_step(create_test_item("e4", "e4"));
        order.add_step(create_test_item("e5", "e5"));

        order.move_step(0, 0); // Should not change anything
        assert_eq!(order.steps[0].item.id, "e4");
        assert_eq!(order.steps[1].item.id, "e5");
    }

    #[test]
    fn test_clear() {
        let mut order = BuildOrder::new("Test Order");
        order.add_step(create_test_item("e4", "e4"));
        order.add_step(create_test_item("e5", "e5"));

        order.clear();
        assert!(order.steps.is_empty());
    }

    #[test]
    fn test_total_time() {
        let mut order = BuildOrder::new("Test Order");
        order.add_step(create_test_item("e4", "e4")); // 1.0
        order.add_step(create_test_item("e5", "e5")); // 1.0
        order.add_step(create_test_item("nf3", "Nf3")); // 1.0

        assert_eq!(order.total_time(), 3.0);
    }

    #[test]
    fn test_total_time_empty() {
        let order = BuildOrder::new("Test Order");
        assert_eq!(order.total_time(), 0.0);
    }

    #[test]
    fn test_build_order_step_creation() {
        let item = create_test_item("e4", "e4");
        let step = BuildOrderStep::new(1, item);

        assert_eq!(step.step_number, 1);
        assert_eq!(step.item.id, "e4");
        assert!(step.notes.is_empty());
    }

    #[test]
    fn test_build_order_step_with_notes() {
        let item = create_test_item("e4", "e4");
        let step = BuildOrderStep::new(1, item).with_notes("Opening move");

        assert_eq!(step.notes, "Opening move");
    }
}
