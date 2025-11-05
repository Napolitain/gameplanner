#include "GameFactory.h"

namespace gameplanner {

std::shared_ptr<Game> GameFactory::CreateStarCraft2Game() {
    auto game = std::make_shared<Game>("sc2", "StarCraft 2");
    game->SetDescription("Real-time strategy game by Blizzard Entertainment");
    
    // Terran units and structures
    auto scv = std::make_shared<GameItem>("scv", "SCV", "Worker");
    scv->SetBuildTime(12.0);
    scv->AddCost(Resource("Minerals", 50));
    scv->SetDescription("Space Construction Vehicle - Terran worker unit");
    game->AddItem(scv);
    
    auto marine = std::make_shared<GameItem>("marine", "Marine", "Infantry");
    marine->SetBuildTime(18.0);
    marine->AddCost(Resource("Minerals", 50));
    marine->SetDescription("Basic Terran infantry unit");
    game->AddItem(marine);
    
    auto marauder = std::make_shared<GameItem>("marauder", "Marauder", "Infantry");
    marauder->SetBuildTime(21.0);
    marauder->AddCost(Resource("Minerals", 100));
    marauder->AddCost(Resource("Gas", 25));
    marauder->SetDescription("Armored Terran infantry unit");
    game->AddItem(marauder);
    
    auto commandCenter = std::make_shared<GameItem>("command_center", "Command Center", "Structure");
    commandCenter->SetBuildTime(71.0);
    commandCenter->AddCost(Resource("Minerals", 400));
    commandCenter->SetDescription("Main Terran base structure");
    game->AddItem(commandCenter);
    
    auto supplyDepot = std::make_shared<GameItem>("supply_depot", "Supply Depot", "Structure");
    supplyDepot->SetBuildTime(21.0);
    supplyDepot->AddCost(Resource("Minerals", 100));
    supplyDepot->SetDescription("Provides supply for Terran units");
    game->AddItem(supplyDepot);
    
    auto barracks = std::make_shared<GameItem>("barracks", "Barracks", "Structure");
    barracks->SetBuildTime(46.0);
    barracks->AddCost(Resource("Minerals", 150));
    barracks->SetDescription("Produces Terran infantry units");
    game->AddItem(barracks);
    
    auto refinery = std::make_shared<GameItem>("refinery", "Refinery", "Structure");
    refinery->SetBuildTime(21.0);
    refinery->AddCost(Resource("Minerals", 75));
    refinery->SetDescription("Harvests vespene gas");
    game->AddItem(refinery);
    
    auto factory = std::make_shared<GameItem>("factory", "Factory", "Structure");
    factory->SetBuildTime(43.0);
    factory->AddCost(Resource("Minerals", 150));
    factory->AddCost(Resource("Gas", 100));
    factory->SetDescription("Produces Terran vehicles");
    game->AddItem(factory);
    
    auto starport = std::make_shared<GameItem>("starport", "Starport", "Structure");
    starport->SetBuildTime(36.0);
    starport->AddCost(Resource("Minerals", 150));
    starport->AddCost(Resource("Gas", 100));
    starport->SetDescription("Produces Terran air units");
    game->AddItem(starport);
    
    return game;
}

std::shared_ptr<Game> GameFactory::CreateHeartsOfIronGame() {
    auto game = std::make_shared<Game>("hoi4", "Hearts of Iron IV");
    game->SetDescription("Grand strategy game by Paradox Interactive");
    
    // Division templates
    auto infantry = std::make_shared<GameItem>("infantry_div", "Infantry Division", "Division");
    infantry->SetBuildTime(90.0);
    infantry->AddCost(Resource("Infantry Equipment", 1000));
    infantry->AddCost(Resource("Support Equipment", 200));
    infantry->SetDescription("Basic infantry division");
    game->AddItem(infantry);
    
    auto armoredDiv = std::make_shared<GameItem>("armored_div", "Armored Division", "Division");
    armoredDiv->SetBuildTime(120.0);
    armoredDiv->AddCost(Resource("Light Tanks", 500));
    armoredDiv->AddCost(Resource("Motorized", 500));
    armoredDiv->SetDescription("Armored division with tanks");
    game->AddItem(armoredDiv);
    
    // Production
    auto civilianFactory = std::make_shared<GameItem>("civ_factory", "Civilian Factory", "Production");
    civilianFactory->SetBuildTime(360.0);
    civilianFactory->AddCost(Resource("Industrial Capacity", 10800));
    civilianFactory->SetDescription("Builds infrastructure and converts to military factories");
    game->AddItem(civilianFactory);
    
    auto militaryFactory = std::make_shared<GameItem>("mil_factory", "Military Factory", "Production");
    militaryFactory->SetBuildTime(360.0);
    militaryFactory->AddCost(Resource("Industrial Capacity", 7200));
    militaryFactory->SetDescription("Produces military equipment");
    game->AddItem(militaryFactory);
    
    // Research
    auto infantryWeapons = std::make_shared<GameItem>("infantry_weapons_1", "Infantry Weapons I", "Research");
    infantryWeapons->SetBuildTime(365.0);
    infantryWeapons->SetDescription("Research improved infantry equipment");
    game->AddItem(infantryWeapons);
    
    auto armorTech = std::make_shared<GameItem>("armor_1", "Great War Tank", "Research");
    armorTech->SetBuildTime(365.0);
    armorTech->SetDescription("Research basic tank technology");
    game->AddItem(armorTech);
    
    return game;
}

std::vector<std::shared_ptr<Game>> GameFactory::CreateAllGames() {
    std::vector<std::shared_ptr<Game>> games;
    games.push_back(CreateStarCraft2Game());
    games.push_back(CreateHeartsOfIronGame());
    return games;
}

} // namespace gameplanner
