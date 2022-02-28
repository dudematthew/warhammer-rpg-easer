<?php
    header('Content-type: text/html; charset=utf-8');
    $templatesFile = file_get_contents("./data/fightEntitiesTemplates.json");
    $templates = json_decode($templatesFile, true);

    function sortTemplateIds ($templates) {
        $id = 0;
        $returnTemplates = [];
        foreach ($templates as $key => $template) {
            $template["id"] = $id;
            $returnTemplates[] = $template;
            $id++;
        }
        return $returnTemplates;
    }

    function getTemplatesWithoutId ($templates, $id) {
        $returnTemplates = [];
        foreach ($templates as $key => $template) {
            if ((int)$template["id"] != (int)$id)
                $returnTemplates[] = $template;
        }
        return $returnTemplates;
    }

    $id = $_GET["remove"] ?? null;
    if ($id !== null) {
        $templates = getTemplatesWithoutId($templates, $id);
        $templates = sortTemplateIds($templates);
    }
    
    
    $jsonToSave = json_encode(sortTemplateIds($templates), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    file_put_contents("./data/fightEntitiesTemplates.json", $jsonToSave);

    if ($id !== null)
        header("location: ./editor.php");

?>


<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <meta name="author" content="Mateusz Moczydłowski" />
    <title>EDYTOR</title>

    <link rel="shortcut icon" href="./img/icon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="main.css" />
    <link rel="stylesheet" href="modifiers.css">
    <link rel="stylesheet" href="./fonts/fontawesome/all.css" />
</head>
<body>
    <div class="main_screen_box">
    <img src="./img/logo.png" class="icon" alt="Warhammer" />
       <h1 class="--no-break">Warhammer 2 RPG Easer Editor v0.1</h1>

        <div class="separate"></div>
        <h2>Edytor Listy Wzorów</h2>

        <!-- ====================================================================================================== -->
        <div class="separate"></div>

        <div class="fight_entities" id="fight_entities">
            <?php foreach ($templates as $key => $template): ?>
            <?php
                if ((int)$template["dmg"] > 0)
                    $template["dmg"] = "S+" . $template["dmg"];
                else if ((int)$template["dmg"] == 0)  
                    $template["dmg"] = "S";
                else
                    $template["dmg"] = "S" . $template["dmg"];
            ?>
            <div class="fight_entity" id="fight_entity_template">
                <div class="fight_entity__name" name="name"><?php print $template["name"] ?></div>
                <div id="hit_location_loading_icon" class="loading_animation--small" name="loading_icon"></div>
                <div class="input-container --no-break">
                    <i class="fas fa-fist-raised icon fight_entity_icon"></i>
                    <input type="number" name="ww" class="icon_input fight_entity__attribute" value="<?php echo $template["ww"] ?>" placeholder="WW" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-eye icon fight_entity_icon"></i>
                    <input type="number" name="us" class="icon_input fight_entity__attribute" value="<?php echo $template["us"] ?>" placeholder="US" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-weight-hanging	icon fight_entity_icon"></i>
                    <input type="number" name="k" class="icon_input fight_entity__attribute" value="<?php echo $template["k"] ?>" placeholder="K" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-shield-alt icon fight_entity_icon"></i>
                    <input type="number" name="odp" class="icon_input fight_entity__attribute" value="<?php echo $template["odp"] ?>" placeholder="Odp" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-running icon fight_entity_icon"></i>
                    <input type="number" name="zr" class="icon_input fight_entity__attribute" value="<?php echo $template["zr"] ?>" placeholder="Zr" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-brain icon fight_entity_icon"></i>
                    <input type="number" name="int" class="icon_input fight_entity__attribute" value="<?php echo $template["int"] ?>" placeholder="Int" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-angry icon fight_entity_icon"></i>
                    <input type="number" name="sw" class="icon_input fight_entity__attribute" value="<?php echo $template["sw"] ?>" placeholder="SW" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-comments icon fight_entity_icon"></i>
                    <input type="number" name="ogd" class="icon_input fight_entity__attribute" value="<?php echo $template["ogd"] ?>" placeholder="Ogd" disabled>
                </div>
                <div class="input-container">
                    <i class="fas fa-heart icon fight_entity_icon"></i>
                    <input type="number" name="hp" class="icon_input fight_entity__attribute" value="<?php echo $template["hp"] ?>" placeholder="Żyw" disabled>
                </div>
                <div class="input-container">
                    <i class="fa fa-plus icon"></i>
                    <input type="number" name="dmg" class="icon_input fight_entity__attribute" value="<?php echo $template["dmg"] ?>" placeholder="S" disabled>
                </div>
                <form action="./editor.php" method="get" class="input-container remove_button_parent">
                    <input type="hidden" name="remove" value="<?php print $template["id"] ?>">
                    <i class="fas fa-trash icon fight_entity_icon --red-background"></i>
                    <button type="submit" class="icon_input fight_entity__attribute">Usuń wzór</button>
                </form>
                <textarea placeholder="Notatki" name="notes" class="fight_entity__attribute" disabled><?php echo $template["notes"] ?></textarea>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="footer">
        <p>Warhammer RPG easer</p>
        <p>Autor: Mateusz Moczydłowski, mmoczydlowski4@gmail.com</p>
        <p>Prawdziwe liczby losowe generowane przez <a href="https://www.random.org" target="_blank">RANDOM.ORG</a></p>
    </div>
</body>
</html>