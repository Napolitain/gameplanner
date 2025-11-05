add_library(GamePlannerLib STATIC
    src/GameFactory.cpp
)

target_include_directories(GamePlannerLib PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_compile_features(GamePlannerLib PUBLIC cxx_std_20)
