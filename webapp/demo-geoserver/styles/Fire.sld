<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Divisional_Fire_Office</Name>
        <UserStyle>
            <Name>Fire</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Single symbol</Name>
                    <PointSymbolizer>
                        <Graphic>
                            <ExternalGraphic>
                                <OnlineResource xlink:type="simple" xlink:href="http://localhost:8080/geoserver/rest/resource/workspaces/MSPudhu/styles/fire_station.svg" />
                                <Format>image/svg+xml</Format>
                            </ExternalGraphic>
                            <Mark>
                                <Fill>
                                    <CssParameter name="fill">#cf1616</CssParameter>
                                </Fill>
                                <Stroke>
                                    <CssParameter name="stroke">#3d8035</CssParameter>
                                    <CssParameter name="stroke-width">2</CssParameter>
                                </Stroke>
                            </Mark>
                            <Size>14</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>