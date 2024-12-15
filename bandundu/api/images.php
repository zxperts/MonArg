<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

function scanDirectory($dir) {
    $images = [];
    if (is_dir($dir)) {
        $files = scandir($dir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..' && $file !== '.gitkeep' && 
                in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'gif'])) {
                $images[] = 'images/carousel/' . $file;
            }
        }
    }
    return $images;
}

$type = isset($_GET['type']) ? $_GET['type'] : '';
$project = isset($_GET['project']) ? $_GET['project'] : '';

$response = [];

if ($type === 'carousel') {
    $carouselDir = __DIR__ . '/../images/carousel';
    $response = scanDirectory($carouselDir);
} elseif ($type === 'project' && !empty($project)) {
    $projectDir = __DIR__ . "/../images/projects/$project";
    $response = scanDirectory($projectDir);
}

$response = [
    'images' => $response,
    'debug' => [
        'type' => $type,
        'project' => $project,
        'dir' => $type === 'carousel' ? $carouselDir : $projectDir,
        'exists' => $type === 'carousel' ? is_dir($carouselDir) : is_dir($projectDir)
    ]
];

echo json_encode($response);