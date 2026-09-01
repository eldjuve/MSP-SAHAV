<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Major_Hazardous_Industry</Name>
        <UserStyle>
            <Name>burg</Name>
            <Title>A small red flag</Title>
            <IsDefault>1</IsDefault>
            <Abstract>A sample of how to use an SVG based symbolizer</Abstract>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Title>Red flag</Title>
                    <PointSymbolizer>
                        <Graphic>
                            <ExternalGraphic>
                                <OnlineResource xlink:type="simple" xlink:href="http://localhost:8080/geoserver/rest/resource/workspaces/MSPudhu/styles/hazard_flag.svg" />
                                <Format>image/svg+xml</Format>
                            </ExternalGraphic>
                            <Size>20</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>