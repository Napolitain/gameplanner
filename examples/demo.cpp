#include "GamePlanner.h"
#include "GameFactory.h"
#include <iostream>
#include <iomanip>

using namespace gameplanner;

void printGame(const std::shared_ptr<Game>& game) {
    std::cout << "\n=== " << game->GetName() << " ===" << std::endl;
    std::cout << game->GetDescription() << std::endl;
    std::cout << "\nAvailable Items (" << game->GetItems().size() << " total):" << std::endl;
    
    for (const auto& item : game->GetItems()) {
        std::cout << "\n  " << item->GetName();
        if (!item->GetCategory().empty()) {
            std::cout << " [" << item->GetCategory() << "]";
        }
        std::cout << std::endl;
        
        if (!item->GetDescription().empty()) {
            std::cout << "    " << item->GetDescription() << std::endl;
        }
        
        if (item->GetBuildTime() > 0) {
            std::cout << "    Build Time: " << item->GetBuildTime() << "s" << std::endl;
        }
        
        if (!item->GetCosts().empty()) {
            std::cout << "    Cost: ";
            for (size_t i = 0; i < item->GetCosts().size(); ++i) {
                if (i > 0) std::cout << ", ";
                const auto& cost = item->GetCosts()[i];
                std::cout << cost.amount << " " << cost.name;
            }
            std::cout << std::endl;
        }
    }
}

void demonstrateBuildOrder(const std::shared_ptr<Game>& game) {
    std::cout << "\n\n=== Sample Build Order for " << game->GetName() << " ===" << std::endl;
    
    BuildOrder buildOrder("Opening Build");
    
    // Create a sample build order for StarCraft 2
    if (game->GetId() == "sc2") {
        auto scv = game->FindItem("scv");
        auto supplyDepot = game->FindItem("supply_depot");
        auto barracks = game->FindItem("barracks");
        auto marine = game->FindItem("marine");
        
        if (scv) {
            buildOrder.AddStep(scv);
            buildOrder.AddStep(scv);
        }
        if (supplyDepot) {
            buildOrder.AddStep(supplyDepot);
        }
        if (scv) {
            buildOrder.AddStep(scv);
        }
        if (barracks) {
            buildOrder.AddStep(barracks);
        }
        if (marine) {
            buildOrder.AddStep(marine);
            buildOrder.AddStep(marine);
        }
    }
    // Create a sample build order for Hearts of Iron IV
    else if (game->GetId() == "hoi4") {
        auto civFactory = game->FindItem("civ_factory");
        auto milFactory = game->FindItem("mil_factory");
        auto infantry = game->FindItem("infantry_div");
        
        if (civFactory) {
            buildOrder.AddStep(civFactory);
        }
        if (milFactory) {
            buildOrder.AddStep(milFactory);
        }
        if (infantry) {
            buildOrder.AddStep(infantry);
            buildOrder.AddStep(infantry);
        }
    }
    
    std::cout << "\nBuild Order: " << buildOrder.GetName() << std::endl;
    std::cout << "Total Steps: " << buildOrder.GetSteps().size() << std::endl;
    std::cout << "\nSteps:" << std::endl;
    
    for (const auto& step : buildOrder.GetSteps()) {
        const auto& item = step->GetItem();
        std::cout << "  " << std::setw(2) << step->GetStepNumber() << ". ";
        std::cout << item->GetName();
        
        if (!item->GetCosts().empty()) {
            std::cout << " (";
            for (size_t i = 0; i < item->GetCosts().size(); ++i) {
                if (i > 0) std::cout << ", ";
                const auto& cost = item->GetCosts()[i];
                std::cout << cost.amount << " " << cost.name;
            }
            std::cout << ")";
        }
        std::cout << std::endl;
    }
}

int main() {
    std::cout << "==================================================" << std::endl;
    std::cout << "    Game Planner - Build Order System Demo" << std::endl;
    std::cout << "==================================================" << std::endl;
    
    // Load all games
    auto games = GameFactory::CreateAllGames();
    
    std::cout << "\nLoaded " << games.size() << " games:" << std::endl;
    for (const auto& game : games) {
        std::cout << "  - " << game->GetName() << std::endl;
    }
    
    // Print details for each game
    for (const auto& game : games) {
        printGame(game);
    }
    
    // Demonstrate build orders
    for (const auto& game : games) {
        demonstrateBuildOrder(game);
    }
    
    std::cout << "\n\n==================================================" << std::endl;
    std::cout << "Demo completed successfully!" << std::endl;
    std::cout << "==================================================" << std::endl;
    
    return 0;
}
