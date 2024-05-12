report({
  "testSuite": "BackstopJS",
  "tests": [
    {
      "pair": {
        "reference": "..\\bitmaps_reference\\03-create-post-change-url\\step1_navigateToLogin_0_body_0_navigateToLogin.png",
        "test": "..\\bitmaps_test\\20240511-172706\\step1_navigateToLogin_0_body_0_navigateToLogin.png",
        "selector": "body",
        "fileName": "step1_navigateToLogin_0_body_0_navigateToLogin.png",
        "label": "navigateToLogin",
        "requireSameDimensions": 0.1,
        "misMatchThreshold": 5,
        "url": "file://backstop-vrt/backstop_data/bitmaps_test/03-create-post-change-url/step1-navigateToLogin.png",
        "expect": 0,
        "viewportLabel": "navigateToLogin",
        "engineErrorMsg": "net::ERR_FILE_NOT_FOUND at file://backstop-vrt/backstop_data/bitmaps_test/03-create-post-change-url/step1-navigateToLogin.png",
        "diff": {
          "isSameDimensions": false,
          "dimensionDifference": {
            "width": -968,
            "height": -581
          },
          "rawMisMatchPercentage": 4.5568331143232585,
          "misMatchPercentage": "4.56",
          "analysisTime": 34
        },
        "diffImage": "..\\bitmaps_test\\20240511-172706\\failed_diff_step1_navigateToLogin_0_body_0_navigateToLogin.png"
      },
      "status": "fail"
    }
  ],
  "id": "step1"
});