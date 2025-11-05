use gameplanner_core::{BuildOrder, ChessGame};
use std::io::{self, Write};

fn main() {
    println!("==================================================");
    println!("    Game Planner - Interactive Chess Demo");
    println!("==================================================\n");

    let game = ChessGame::create();

    println!("Game: {}", game.name);
    println!("{}\n", game.description);
    println!("Available Moves ({} total):\n", game.items.len());

    // Display all available moves grouped by category
    let mut categories: Vec<String> = game
        .items
        .iter()
        .map(|item| item.category.clone())
        .collect();
    categories.sort();
    categories.dedup();

    for category in &categories {
        println!("  [{}]", category);
        for item in &game.items {
            if &item.category == category {
                println!("    {} - {}", item.name, item.description);
            }
        }
        println!();
    }

    // Interactive menu
    loop {
        println!("\n--- Menu ---");
        println!("1. View sample openings");
        println!("2. Create custom build order");
        println!("3. Exit");
        print!("\nChoose an option: ");
        io::stdout().flush().unwrap();

        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();

        match input.trim() {
            "1" => view_sample_openings(&game),
            "2" => create_custom_build_order(&game),
            "3" => {
                println!("\nThank you for using Game Planner!");
                break;
            }
            _ => println!("Invalid option. Please try again."),
        }
    }
}

fn view_sample_openings(game: &gameplanner_core::Game) {
    println!("\n=== Sample Chess Openings ===\n");

    // Italian Game
    println!("1. Italian Game:");
    let italian = ChessGame::italian_game_sample();
    display_opening(&italian, game);

    // Ruy Lopez
    println!("\n2. Ruy Lopez:");
    let ruy_lopez = ChessGame::ruy_lopez_sample();
    display_opening(&ruy_lopez, game);

    // Sicilian Defense
    println!("\n3. Sicilian Defense:");
    let sicilian = ChessGame::sicilian_defense_sample();
    display_opening(&sicilian, game);
}

fn display_opening(moves: &[String], game: &gameplanner_core::Game) {
    let mut build_order = BuildOrder::new("Opening");

    for move_id in moves {
        if let Some(item) = game.find_item(move_id) {
            build_order.add_step(item);
        }
    }

    for (i, step) in build_order.steps.iter().enumerate() {
        let move_num = (i / 2) + 1;
        let color = if i % 2 == 0 { "White" } else { "Black" };
        println!(
            "   {}. {} - {} ({})",
            move_num, color, step.item.name, step.item.description
        );
    }
    println!("   Total moves: {}", build_order.steps.len());
}

fn create_custom_build_order(game: &gameplanner_core::Game) {
    println!("\n=== Create Custom Build Order ===");
    print!("Enter build order name: ");
    io::stdout().flush().unwrap();

    let mut name = String::new();
    io::stdin().read_line(&mut name).unwrap();
    let name = name.trim();

    let mut build_order = BuildOrder::new(name);

    loop {
        println!("\nCurrent sequence:");
        if build_order.steps.is_empty() {
            println!("  (empty)");
        } else {
            for step in &build_order.steps {
                println!("  {}. {}", step.step_number, step.item.name);
            }
            println!("  Total time: {:.1} moves", build_order.total_time());
        }

        println!("\nOptions:");
        println!("  1. Add move");
        println!("  2. Remove last move");
        println!("  3. Clear all");
        println!("  4. Save and return");
        print!("\nChoose: ");
        io::stdout().flush().unwrap();

        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();

        match input.trim() {
            "1" => add_move(&mut build_order, game),
            "2" => {
                if !build_order.steps.is_empty() {
                    build_order.remove_step(build_order.steps.len() - 1);
                    println!("Removed last move.");
                } else {
                    println!("Build order is empty.");
                }
            }
            "3" => {
                build_order.clear();
                println!("Cleared all moves.");
            }
            "4" => {
                println!("\nFinal Build Order: {}", build_order.name);
                for step in &build_order.steps {
                    println!("  {}. {}", step.step_number, step.item.name);
                }
                return;
            }
            _ => println!("Invalid option."),
        }
    }
}

fn add_move(build_order: &mut BuildOrder, game: &gameplanner_core::Game) {
    print!("\nEnter move ID (e.g., e4, nf3, bc4): ");
    io::stdout().flush().unwrap();

    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let move_id = input.trim().to_lowercase();

    if let Some(item) = game.find_item(&move_id) {
        build_order.add_step(item);
        println!("Added move: {}", move_id);
    } else {
        println!("Move '{}' not found. Available moves:", move_id);
        for item in game.items.iter().take(10) {
            println!("  {} - {}", item.id, item.name);
        }
        println!("  ... and {} more", game.items.len().saturating_sub(10));
    }
}
